const prisma = require("../prisma");
const { generateNonce } = require("./badgeService");

async function createSession(userId) {
  const nonce = generateNonce();

  const session = await prisma.session.create({
    data: {
      userId,
      nonce
    }
  });

  return session;
}

module.exports = {
  createSession
};
