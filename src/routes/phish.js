const express = require("express");
const prisma = require("../prisma");
const { createSession } = require("../services/sessionService");

const router = express.Router();

router.post("/start", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

const session = await createSession(user.id, "phishing");

let fakeBadge = null;

if (user.loginMode === "mva") {
  fakeBadge = ["🐵", "🐸", "🐔", "🐢"];

  await prisma.session.update({
    where: { id: session.id },
    data: { dynamicBadge: fakeBadge }
  });
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

router.post("/submit", async (req, res) => {
  try {
    const { email, sessionId, timeToDecision, confidenceScore } = req.body;

    if (!sessionId) return res.status(400).json({ error: "Session required" });

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session || session.used || new Date() > session.expiresAt)
      return res.status(400).json({ error: "Invalid or expired session" });

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user || user.email !== email)
      return res.status(400).json({ error: "Invalid credentials" });

    await prisma.$transaction([
      prisma.session.update({
        where: { id: sessionId },
        data: { used: true }
      }),
      prisma.experimentLog.create({
        data: {
          userId: user.id,
          sessionId: session.id,
          condition: user.loginMode,
          pageType: session.pageType,
          decisionType: "SUBMIT",
          timeToDecision,
          confidenceScore
        }
      })
    ]);

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Phish submit failed" });
  }
});

module.exports = router;
