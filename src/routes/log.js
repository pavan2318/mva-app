const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/*
Logs behavioural decision during real or phishing page
*/

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      condition,
      pageType,
      timeToDecision,
      credentialsSubmitted,
      confidenceScore
    } = req.body;

    if (!userId || !condition || !pageType || timeToDecision == null || credentialsSubmitted == null) {
      return res.status(400).json({ error: "Missing required log fields" });
    }

    await prisma.experimentLog.create({
      data: {
        userId,
        condition,
        pageType,
        timeToDecision,
        credentialsSubmitted,
        confidenceScore
      }
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logging failed" });
  }
});

module.exports = router;
