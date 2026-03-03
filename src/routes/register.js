const express = require("express")
const bcrypt = require("bcrypt")
const prisma = require("../prisma")
const experimentActive = require("../middleware/experimentActive")

const router = express.Router()

async function assignBalancedCondition() {
  const traditionalCount = await prisma.user.count({
    where: { loginMode: "traditional" }
  })

  const mvaCount = await prisma.user.count({
    where: { loginMode: "mva" }
  })

  if (traditionalCount === mvaCount) {
    return Math.random() < 0.5 ? "traditional" : "mva"
  }

  return traditionalCount < mvaCount ? "traditional" : "mva"
}

/*
STEP 1 → DECIDE CONDITION
*/

router.post("/start", experimentActive, async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: "Email required" })
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return res.status(400).json({ error: "User already exists" })
    }

    const loginMode = await assignBalancedCondition()

    res.json({ loginMode })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Registration start failed" })
  }
})

/*
STEP 2 → COMPLETE REGISTRATION
*/

router.post("/complete", experimentActive, async (req, res) => {
  try {
    const { email, password, loginMode, emojis } = req.body

    if (!email || !password || !loginMode) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const existing = await prisma.user.findUnique({
      where: { email }
    })

    if (existing) {
      return res.status(400).json({ error: "User already exists" })
    }

    if (loginMode === "mva") {
      if (!emojis || emojis.length !== 4) {
        return res
          .status(400)
          .json({ error: "MVA users must select 4 emojis" })
      }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        loginMode,
        selectedEmojis: loginMode === "mva" ? emojis : [],
        round1CompletedAt: null,
        round2Completed: false
      }
    })

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Registration failed" })
  }
})

module.exports = router
