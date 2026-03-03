const prisma = require("../prisma")

async function getActiveConfig() {
  const config = await prisma.systemConfig.findUnique({
    where: { id: "active" },
    include: { activeVersion: true }
  })

  if (!config) {
    throw new Error("SystemConfig not initialized")
  }

  return config.activeVersion
}

module.exports = {
  getActiveConfig
}
