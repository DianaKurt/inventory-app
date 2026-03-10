import bcrypt from 'bcryptjs'
import { prisma } from './db'

async function main() {
  const adminEmail = 'admin@local'
  const userEmail = 'user@local'

  const adminPass = await bcrypt.hash('admin123', 10)
  const userPass = await bcrypt.hash('user123', 10)

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: adminPass,     
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      role: 'ADMIN',
      passwordHash: adminPass,
    },
  })

  await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      name: 'User',
      role: 'USER',
      passwordHash: userPass,      
    },
    create: {
      email: userEmail,
      name: 'User',
      role: 'USER',
      passwordHash: userPass,
    },
  })

  console.log('Seed done')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
