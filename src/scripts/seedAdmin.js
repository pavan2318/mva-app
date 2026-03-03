const prisma = require("../prisma")
const bcrypt = require("bcrypt")

async function main() {
  const email = "root@hackerman.local"
  const password = "123"

  const existing = await prisma.adminUser.findUnique({ where: { email } })
  if (existing) {
    console.log("Admin already exists.")
    return
  }

  const hash = await bcrypt.hash(password, 12)

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash: hash,
      role: "SUPERADMIN"
    }
  })

  console.log("SuperAdmin created.")
  console.log("Email:", email)
  console.log("Password:", password)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
