const express = require("express")
const prisma = require("../../prisma")
const adminAuth = require("../../middleware/adminAuth")

const router = express.Router()
router.use(adminAuth)

/*
Experiment Health Engine
*/

router.get("/", async (req, res) => {
  try {
    const totalUsers = await prisma.user.count()

    const round1Completed = await prisma.user.count({
      where: { round1CompletedAt: { not: null } }
    })

    const round2Completed = await prisma.user.count({
      where: { round2Completed: true }
    })

    const mvaUsers = await prisma.user.count({
      where: { loginMode: "mva" }
    })

    const traditionalUsers = await prisma.user.count({
      where: { loginMode: "traditional" }
    })

    const phishingLogs = await prisma.experimentLog.count({
      where: { pageType: "phishing" }
    })

    const realLogs = await prisma.experimentLog.count({
      where: { pageType: "real" }
    })

    res.json({
      totalUsers,
      round1Completed,
      round2Completed,
      mvaUsers,
      traditionalUsers,
      phishingLogs,
      realLogs
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Health fetch failed" })
  }
})

module.exports = router
