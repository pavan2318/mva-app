const prisma = require("../prisma");
const crypto = require("crypto");

async function createSession(userId, pageType) {
  const nonce = crypto.randomBytes(16).toString("hex");

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  return prisma.session.create({
    data: {
      userId,
      nonce,
      pageType,
      expiresAt
    }
  });
}

module.exports = { createSession };
