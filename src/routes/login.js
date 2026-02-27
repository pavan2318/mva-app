const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const { createSession } = require("../services/sessionService");
const { deriveDynamicBadge } = require("../services/badgeService");
const { recordAttempt, isBlocked } = require("../services/throttleService");

const router = express.Router();

/*
STEP 1:
User submits email
Server responds with:
- loginMode
- sessionId
- dynamic badge (if MVA)
*/

router.post("/start", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const session = await createSession(user.id);

    let badge = null;

    if (user.loginMode === "mva") {
      badge = deriveDynamicBadge(user.badgeSecret, session.nonce);
    }

    res.json({
      loginMode: user.loginMode,
      sessionId: session.id,
      badge
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login start failed" });
  }
});


/*
STEP 2:
User submits password
*/

router.post("/complete", async (req, res) => {
  try {
    const { email, password, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session required" });
    }

    if (isBlocked(email)) {
      return res.status(429).json({
        error: "Too many login attempts for this account."
      });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      recordAttempt(email);
      return res.status(400).json({ error: "Invalid session" });
    }

    if (session.used) {
      return res.status(400).json({ error: "Session already used" });
    }

    if (new Date() > session.expiresAt) {
      return res.status(400).json({ error: "Session expired" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user || user.email !== email) {
      recordAttempt(email);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      recordAttempt(email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Mark session as used AFTER successful authentication
    await prisma.session.update({
      where: { id: sessionId },
      data: { used: true }
    });

    recordAttempt(email);

await prisma.experimentLog.create({
  data: {
    userId: user.id,
    sessionId: session.id,
    condition: user.loginMode,
    pageType: "real",
    timeToDecision: 0,
    credentialsSubmitted: true,
    confidenceScore: null
  }
});

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
