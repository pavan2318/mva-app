const prisma = require("../prisma");

async function sweepExpiredSessions() {
  console.log("Sweeper tick:", new Date().toISOString());

  const expired = await prisma.session.findMany({
    where: {
      used: false,
      expiresAt: { lt: new Date() }
    },
    include: {
      user: true
    }
  });

  console.log("Expired sessions found:", expired.length);

  for (const session of expired) {
    console.log("Finalizing:", session.id);

    await prisma.$transaction([
      prisma.session.update({
        where: { id: session.id },
        data: { used: true }
      }),
      prisma.experimentLog.create({
        data: {
          userId: session.userId,
          sessionId: session.id,
          condition: session.user.loginMode,
          pageType: session.pageType,
          decisionType: "TIMEOUT"
        }
      })
    ]);
  }
}

module.exports = { sweepExpiredSessions };
