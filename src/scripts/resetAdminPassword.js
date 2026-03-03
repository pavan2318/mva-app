const prisma = require("../prisma")
const bcrypt = require("bcrypt")

async function main() {
  const email = "root@hackerman.local"
  const newPassword = "123"

  const admin = await prisma.adminUser.findUnique({ where: { email } })

  if (!admin) {
    console.log("Admin not found")
    return
  }

  const hash = await bcrypt.hash(newPassword, 12)

  await prisma.adminUser.update({
    where: { email },
    data: { passwordHash: hash }
  })

  console.log("Password updated successfully.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
