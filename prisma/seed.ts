import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

 
  const user1 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@email.com',
      registration: 'REG-001', 
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Pedro Oliveira',
      email: 'pedro@email.com',
      registration: 'REG-002',
    },
  })

  console.log('✅ Seed concluído!')
  console.log('Criados:', user1.name, 'e', user2.name)
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
