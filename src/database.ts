import { PrismaClient } from '@prisma/client'

// Criar instância do Prisma Client
export const prisma = new PrismaClient()

// Função para conectar
export async function connect() {
  try {
    await prisma.$connect()
    console.log('✅ Conectado ao MongoDB!')
  } catch (error) {
    console.error('❌ Erro ao conectar:', error)
    process.exit(1)
  }
}

// Função para desconectar
export async function disconnect() {
  await prisma.$disconnect()
  console.log('✅ Desconectado do MongoDB!')
}
