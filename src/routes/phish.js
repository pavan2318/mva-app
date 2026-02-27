const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/*
Static phishing simulation.
Does NOT compute real badge.
Returns fake badge for MVA users.
*/

router.post("/start", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    let fakeBadge = null;

    if (user.loginMode === "mva") {
      fakeBadge = ["🐵","🐸","🐔","🐢"]; // fixed incorrect badge
    }

    res.json({
      loginMode: user.loginMode,
      badge: fakeBadge
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Phish start failed" });
  }
});

/*
Capture credentials (do NOT validate password)
*/

router.post("/submit", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Intentionally do nothing with password
    // This simulates attacker capture
await prisma.experimentLog.create({
  data: {
    userId: user.id,
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
