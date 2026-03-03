const express = require("express")
const prisma = require("../../prisma")
const adminAuth = require("../../middleware/adminAuth")

const router = express.Router()
router.use(adminAuth)

/*
List Users
*/

router.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  })

  res.json(users)
})

/*
Reset User
*/

router.post("/:id/reset", async (req, res) => {
  await prisma.user.update({
    where: { id: req.params.id },
    data: {
      round1CompletedAt: null,
      round2Completed: false
    }
  })

  res.json({ success: true })
})

/*
Force Condition Override (SUPERADMIN only)
*/

router.post("/:id/override", async (req, res) => {
  const { mode } = req.body

  if (!["mva", "traditional", null].includes(mode)) {
    return res.status(400).json({ error: "Invalid mode" })
  }

  await prisma.user.update({
    where: { id: req.params.id },
    data: { conditionOverride: mode }
  })

  res.json({ success: true })
})

module.exports = router
