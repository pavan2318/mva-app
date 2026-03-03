const express = require("express")
const prisma = require("../../prisma")
const adminAuth = require("../../middleware/adminAuth")

const router = express.Router()
router.use(adminAuth)

router.get("/", async (req, res) => {
  let runtime = await prisma.runtimeOverride.findUnique({
    where: { id: "runtime" }
  })

  if (!runtime) {
    runtime = await prisma.runtimeOverride.create({
      data: { id: "runtime" }
    })
  }

  res.json(runtime)
})

router.post("/", async (req, res) => {
  const { paused, forceDelay, forceExpiry } = req.body

  const updated = await prisma.runtimeOverride.upsert({
    where: { id: "runtime" },
    update: { paused, forceDelay, forceExpiry },
    create: {
      id: "runtime",
      paused,
      forceDelay,
      forceExpiry
    }
  })

  res.json(updated)
})

module.exports = router
