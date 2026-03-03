const express = require("express")
const bcrypt = require("bcrypt")
const prisma = require("../prisma")
const { createSession } = require("../services/sessionService")
const { recordAttempt, isBlocked } = require("../services/throttleService")

const router = express.Router()

/*
STEP 1 → LOGIN START (ROUND 1 ONLY)
*/

router.post("/start", async (req, res) => {
  try {
    const { email } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: "User not found" })

    if (user.round1CompletedAt) {
      return res.status(403).json({ error: "Round 1 already completed" })
    }

    const session = await createSession(user.id, "real")

    let badge = null

    if (user.loginMode === "mva") {
      badge = user.selectedEmojis
    }

    res.json({
      loginMode: user.loginMode,
      sessionId: session.id,
      badge
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Login start failed" })
  }
})

/*
STEP 2 → LOGIN COMPLETE
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

    const serverDurationMs =
      Date.now() - new Date(session.serverPageLoadAt).getTime()

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
          pageType: "real",
          decisionType: "SUBMIT",
          timeToDecision,
          confidenceScore,
          serverDurationMs
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { round1CompletedAt: new Date() }
      })
    ])

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Login failed" })
  }
})

module.exports = router
