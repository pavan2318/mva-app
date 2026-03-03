const express = require("express");
const prisma = require("../../prisma");
const adminAuth = require("../../middleware/adminAuth");

const router = express.Router();

router.get("/", adminAuth, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();

    const conditionBreakdown = await prisma.user.groupBy({
      by: ["loginMode"],
      _count: true
    });

    const totalLogs = await prisma.experimentLog.count();

    res.json({
      admin: {
        id: req.admin.id,
        email: req.admin.email,
        role: req.admin.role
      },
      stats: {
        totalUsers,
        conditionBreakdown,
        totalLogs
      }
    });

  } catch (err) {
    res.status(500).json({ error: "Dashboard failed" });
  }
});

module.exports = router;
