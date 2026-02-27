const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/*
Enrich existing experiment log instead of inserting new one
*/

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      pageType,
      timeToDecision,
      confidenceScore
    } = req.body;

    if (!userId || !pageType) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Find most recent matching auto log
    const log = await prisma.experimentLog.findFirst({
      where: {
        userId,
        pageType,
        timeToDecision: 0
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    if (!log) {
      return res.status(400).json({ error: "No matching log found" });
    }

    const updated = await prisma.experimentLog.update({
      where: { id: log.id },
      data: {
        timeToDecision,
        confidenceScore
      }
    });

    res.json({ success: true, updatedId: updated.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Log update failed" });
  }
});

module.exports = router;
