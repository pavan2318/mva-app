const express = require("express")
const prisma = require("../../prisma")
const adminAuth = require("../../middleware/adminAuth")

const router = express.Router()
router.use(adminAuth)

router.get("/", async (req, res) => {
  const logs = await prisma.adminAuditLog.findMany({
    include: { admin: true },
    orderBy: { createdAt: "desc" },
    take: 300
  })

  res.json(logs)
})

module.exports = router
