const prisma = require("../prisma")

async function main() {
  const existing = await prisma.systemConfig.findUnique({
    where: { id: "active" }
  })

  if (existing) {
    console.log("SystemConfig already exists.")
    return
  }

  const version = await prisma.systemConfigVersion.create({
    data: {
      versionNumber: 1,
      round2DelayHours: 0.01,
      sessionExpiryMinutes: 10,
      throttleEnabled: true,
      experimentActive: true,
      allowRetakes: false,
      autoLogTimeout: true,
      phishingBadgeMode: "hardcoded",
      createdByAdminId: "system"
    }
  })

  await prisma.systemConfig.create({
    data: {
      id: "active",
      activeVersionId: version.id
    }
  })

  console.log("Initial SystemConfig seeded.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
