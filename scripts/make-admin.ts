import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  
  if (!email) {
    console.log('❌ Please provide an email address')
    console.log('Usage: npx tsx scripts/make-admin.ts <email>')
    process.exit(1)
  }
  
  console.log(`🔧 Making user admin: ${email}`)
  
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  })

  console.log(`✅ User ${user.email} is now an ADMIN!`)
  console.log('\n⚠️  Please sign out and sign back in for changes to take effect.')
}

main()
  .catch((e) => {
    if (e.code === 'P2025') {
      console.error('❌ User not found!')
    } else {
      console.error('❌ Error:', e)
    }
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

