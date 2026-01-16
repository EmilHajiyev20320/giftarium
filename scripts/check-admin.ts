import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2] || 'admin@giftarium.com'
  
  console.log(`🔍 Checking user: ${email}`)
  
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  })

  if (!user) {
    console.log('❌ User not found!')
    process.exit(1)
  }

  console.log('\n📋 User Details:')
  console.log(`   ID: ${user.id}`)
  console.log(`   Email: ${user.email}`)
  console.log(`   Name: ${user.name || 'No name'}`)
  console.log(`   Role: ${user.role}`)
  console.log(`   Created: ${user.createdAt.toLocaleString()}`)

  if (user.role !== 'ADMIN') {
    console.log('\n⚠️  User is NOT an admin!')
    console.log('\nTo make this user an admin, run:')
    console.log(`   npx tsx scripts/make-admin.ts ${email}`)
  } else {
    console.log('\n✅ User is an ADMIN!')
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

