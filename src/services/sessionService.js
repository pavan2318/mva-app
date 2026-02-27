const prisma = require("../prisma");
const { generateNonce } = require("./badgeService");

/*
Creates a new session with:
- random nonce
- used = false
- expires in 5 minutes
*/

async function createSession(userId) {
  const nonce = generateNonce();

const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

 const session = await prisma.session.create({
    data: {
      userId,
      nonce,
      used: false,
      expiresAt
    }
  });

  return session;
}

module.exports = {
  createSession
};
