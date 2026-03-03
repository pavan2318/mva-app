const prisma = require("../prisma")
const { getRuntimeConfig } = require("./runtimeConfig")

async function createSession(userId, pageType) {
  const config = await getRuntimeConfig()

  const expiryMinutes = config?.sessionExpiryMinutes || 10

  const expiresAt = new Date(
    Date.now() + expiryMinutes * 60 * 1000
  )

  return prisma.session.create({
    data: {
      userId,
      pageType,
      expiresAt
    }
  })
}

module.exports = { createSession }
