const { getRuntimeConfig } = require("../services/runtimeConfig")

async function experimentActive(req, res, next) {
  const config = await getRuntimeConfig()

  if (!config?.experimentActive) {
    return res.status(503).json({
      error: "Experiment temporarily disabled"
    })
  }

  next()
}

module.exports = experimentActive
