const express = require("express")
const prisma = require("../../prisma")
const adminAuth = require("../../middleware/adminAuth")

const router = express.Router()
router.use(adminAuth)

const ALLOWED_COLUMNS = [
  "id",
  "createdAt",
  "condition",
  "pageType",
  "decisionType",
  "timeToDecision",
  "confidenceScore",
  "serverDurationMs"
]

/*
DATASET BUILDER
*/

router.post("/query", async (req, res) => {
  try {
    const {
      condition,
      pageType,
      decisionType,
      startDate,
      endDate,
      limit = 200,
      columns
    } = req.body

    const where = {}

    if (condition) where.condition = condition
    if (pageType) where.pageType = pageType
    if (decisionType) where.decisionType = decisionType

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const selectedColumns =
      Array.isArray(columns) && columns.length
        ? columns.filter(c => ALLOWED_COLUMNS.includes(c))
        : ALLOWED_COLUMNS

    const select = {}
    selectedColumns.forEach(c => (select[c] = true))

    const logs = await prisma.experimentLog.findMany({
      where,
      select,
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 1000)
    })

    res.json({ logs })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Query failed" })
  }
})

/*
STATISTICAL COMPARISON ENGINE
*/

router.get("/compare", async (req, res) => {
  try {
    const logs = await prisma.experimentLog.findMany()

    const group = (condition, pageType) =>
      logs.filter(
        l => l.condition === condition && l.pageType === pageType
      )

    const compute = arr => {
      if (!arr.length)
        return { total: 0, submitRate: 0, avgTime: 0 }

      const submitRate =
        arr.filter(l => l.decisionType === "SUBMIT").length /
        arr.length

      const avgTime =
        arr.reduce((a, b) => a + (b.timeToDecision || 0), 0) /
        arr.length

      return {
        total: arr.length,
        submitRate,
        avgTime
      }
    }

    const mvaPhish = compute(group("mva", "phishing"))
    const tradPhish = compute(group("traditional", "phishing"))

    const deltaSubmit =
      mvaPhish.submitRate - tradPhish.submitRate

    const deltaTime =
      mvaPhish.avgTime - tradPhish.avgTime

    res.json({
      phishing: {
        mva: mvaPhish,
        traditional: tradPhish,
        deltaSubmit,
        deltaTime
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Compare failed" })
  }
})

module.exports = router
