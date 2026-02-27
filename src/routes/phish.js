const express = require("express");
const prisma = require("../prisma");
const { createSession } = require("../services/sessionService");

const router = express.Router();

/*
STEP 1:
User lands on phishing page
We create a session to mirror real login flow
*/

router.post("/start", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const session = await createSession(user.id);

    let fakeBadge = null;

    if (user.loginMode === "mva") {
      fakeBadge = ["🐵", "🐸", "🐔", "🐢"];
    }

    res.json({
      loginMode: user.loginMode,
      sessionId: session.id,
      badge: fakeBadge
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Phish start failed" });
  }
});

/*
STEP 2:
User submits credentials to phishing page
*/

router.post("/submit", async (req, res) => {
  try {
    const { email, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session required" });
    }

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      return res.status(400).json({ error: "Invalid session" });
    }

    if (session.used) {
      return res.status(400).json({ error: "Session already used" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    });

    if (!user || user.email !== email) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    await prisma.session.update({
      where: { id: sessionId },
      data: { used: true }
    });

    await prisma.experimentLog.create({
      data: {
        userId: user.id,
        sessionId: session.id,
        condition: user.loginMode,
        pageType: "phishing",
        timeToDecision: 0,
        credentialsSubmitted: true,
        confidenceScore: null
      }
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Phish submit failed" });
  }
});

module.exports = router;
