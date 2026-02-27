const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

/*
Admin export endpoint
WARNING: No auth yet (dev only)
*/

router.get("/export", async (req, res) => {
  try {
    const logs = await prisma.experimentLog.findMany({
      include: {
        user: {
          select: {
            email: true,
            loginMode: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    res.json({ count: logs.length, data: logs });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Export failed" });
  }
});

module.exports = router;
