const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const { createSession } = require("../services/sessionService");
const { deriveDynamicBadge } = require("../services/badgeService");

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

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(400).json({ error: "Invalid session" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user || user.email !== email) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
