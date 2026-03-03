const express = require("express")
const bcrypt = require("bcrypt")
const prisma = require("../prisma")
const { createSession } = require("../services/sessionService")
const { recordAttempt, isBlocked } = require("../services/throttleService")
const { getRuntimeConfig } = require("../services/runtimeConfig")

const router = express.Router()

/*
STEP 1 → ROUND 2 START (PHISHING)
*/

router.post("/start", async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: "User not found" })

    if (!user.round1CompletedAt)
      return res.status(403).json({ error: "Round 1 not completed" })

    const hoursSinceRound1 =
      (Date.now() - new Date(user.round1CompletedAt).getTime()) /
      (1000 * 60 * 60)

    const config = await getRuntimeConfig()

    if (hoursSinceRound1 < config.round2DelayHours)
      return res.status(403).json({ error: "Round 2 not yet available" })

    if (user.round2Completed)
      return res.status(403).json({ error: "Round 2 already completed" })

    const session = await createSession(user.id, "phishing")

    let badge = null

    if (user.loginMode === "mva") {
      badge = ["🐸", "🐧", "🐝", "🐢"]
    }

    res.json({
      loginMode: user.loginMode,
      sessionId: session.id,
      badge
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Round 2 start failed" })
  }
})

/*
STEP 2 → ROUND 2 COMPLETE
*/

router.post("/complete", async (req, res) => {
  try {
    const { password, sessionId, timeToDecision, confidenceScore } = req.body

    if (!sessionId)
      return res.status(400).json({ error: "Session required" })

    const session = await prisma.session.findUnique({
      where: { id: sessionId }
    })

    if (!session || session.used || new Date() > session.expiresAt)
      return res.status(400).json({ error: "Invalid or expired session" })

    const user = await prisma.user.findUnique({
      where: { id: session.userId }
    })

    if (!user)
      return res.status(400).json({ error: "Invalid credentials" })

    const blocked = await isBlocked(user.email)
    if (blocked)
      return res.status(429).json({ error: "Too many login attempts" })

    const valid = await bcrypt.compare(password, user.passwordHash)

    if (!valid) {
      await recordAttempt(user.email)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    await prisma.$transaction([
      prisma.session.update({
        where: { id: sessionId },
        data: { used: true }
      }),
      prisma.experimentLog.create({
        data: {
          userId: user.id,
          sessionId: session.id,
          condition: user.loginMode,
          pageType: "phishing",
          decisionType: "SUBMIT",
          timeToDecision,
          confidenceScore
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { round2Completed: true }
      })
    ])

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Round 2 complete failed" })
  }
})

module.exports = router
