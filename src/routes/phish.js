const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../prisma");
const { createSession } = require("../services/sessionService");
const { recordAttempt, isBlocked } = require("../services/throttleService");

const router = express.Router();

/*
ROUND 2 → PHISH START
*/

router.post("/start", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Must have completed Round 1
    if (!user.round1CompletedAt) {
      return res.status(403).json({ error: "Round 2 not available." });
    }

    // Enforce 48-hour delay
    const hours48 = 48 * 60 * 60 * 1000;
    const now = Date.now();
    const round1Time = new Date(user.round1CompletedAt).getTime();

    if (now < round1Time + hours48) {
      return res.status(403).json({ error: "Round 2 not yet available." });
    }

    // Prevent repeating Round 2
    if (user.round2Completed) {
      return res.status(403).json({ error: "Round 2 already completed." });
    }

    const session = await createSession(user.id, "phishing");

    let badge = null;

    if (user.loginMode === "mva" && user.selectedEmojis.length === 4) {
      // Always incorrect badge
      badge = ["🐸", "🐧", "🐝", "🐢"];
    }

    res.json({
      loginMode: user.loginMode,
      sessionId: session.id,
      badge
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Phish start failed" });
  }
});

/*
ROUND 2 → PHISH COMPLETE
*/

router.post("/complete", async (req, res) => {
  try {
    const { password, sessionId, timeToDecision, confidenceScore } = req.body;

    if (!sessionId)
      return res.status(400).json({ error: "Session required" });

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session || session.used || new Date() > session.expiresAt)
      return res.status(400).json({ error: "Invalid or expired session" });

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    if (isBlocked(user.email))
      return res.status(429).json({ error: "Too many login attempts" });

    const valid = await bcrypt.compare(password, user.passwordHash);

    if (!valid) {
      recordAttempt(user.email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    await prisma.$transaction([
      prisma.session.update({
        where: { id: sessionId },
        data: { used: true }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { round2Completed: true }
      }),
      prisma.experimentLog.create({
        data: {
          userId: user.id,
          sessionId: session.id,
          condition: user.loginMode,
          pageType: "phishing",
          decisionType: "SUBMIT",
          timeToDecision,
          confidenceScore
        }
      })
    ]);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Phish complete failed" });
  }
});

module.exports = router;
