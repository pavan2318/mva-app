const express = require("express")
const prisma = require("../../prisma")
const adminAuth = require("../../middleware/adminAuth")

const router = express.Router()
router.use(adminAuth)

/*
Get Active Config + History
*/

router.get("/", async (req, res) => {
  const system = await prisma.systemConfig.findUnique({
    where: { id: "active" },
    include: { activeVersion: true }
  })

  const history = await prisma.systemConfigVersion.findMany({
    orderBy: { versionNumber: "desc" }
  })

  res.json({
    active: system?.activeVersion,
    history
  })
})

/*
Apply New Version
*/

router.post("/apply", async (req, res) => {
  const {
    round2DelayHours,
    sessionExpiryMinutes,
    throttleEnabled,
    experimentActive,
    allowRetakes,
    autoLogTimeout,
    phishingBadgeMode
  } = req.body

  const latest = await prisma.systemConfigVersion.findFirst({
    orderBy: { versionNumber: "desc" }
  })

  const newVersion = await prisma.systemConfigVersion.create({
    data: {
      versionNumber: latest ? latest.versionNumber + 1 : 1,
      round2DelayHours,
      sessionExpiryMinutes,
      throttleEnabled,
      experimentActive,
      allowRetakes,
      autoLogTimeout,
      phishingBadgeMode,
      createdByAdminId: req.admin.id
    }
  })

  await prisma.systemConfig.upsert({
    where: { id: "active" },
    update: { activeVersionId: newVersion.id },
    create: {
      id: "active",
      activeVersionId: newVersion.id
    }
  })

  res.json({ success: true })
})

module.exports = router
