const prisma = require("../prisma")

let cachedConfig = null
let lastFetch = 0

async function getRuntimeConfig() {
  const now = Date.now()

  // refresh every 10 seconds
  if (!cachedConfig || now - lastFetch > 10000) {
    const active = await prisma.systemConfig.findUnique({
      where: { id: "active" },
      include: { activeVersion: true }
    })

    cachedConfig = active?.activeVersion
    lastFetch = now
  }

  return cachedConfig
}

module.exports = { getRuntimeConfig }
