import { PrismaClient } from '@prisma/client'

// ========================================
// SINGLETON DO PRISMA CLIENT
// ========================================

let prisma: PrismaClient

function getPrismaClient(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  }
  return prisma
}

export const db = getPrismaClient()

// ========================================
// FUNÇÕES DE CONEXÃO
// ========================================

export async function conectar(): Promise<void> {
  try {
    await db.$connect()
    console.log('✅ Conectado ao MongoDB com sucesso!')
  } catch (erro) {
    console.error('❌ Erro ao conectar ao MongoDB:', erro)
    throw erro
  }
}

export async function desconectar(): Promise<void> {
  try {
    await db.$disconnect()
    console.log('✅ Desconectado do MongoDB com sucesso!')
  } catch (erro) {
    console.error('❌ Erro ao desconectar do MongoDB:', erro)
    throw erro
  }
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

process.on('beforeExit', async () => {
  await desconectar()
})

process.on('SIGINT', async () => {
  await desconectar()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await desconectar()
  process.exit(0)
})

// ========================================
// TIPOS BASE
// ========================================

export type BaseEntity = {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type CreateData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateData<T> = Partial<CreateData<T>>

// ========================================
// FUNÇÕES GENÉRICAS DE CRUD
// ========================================

export async function findAll<T>(
  model: any,
  orderBy: string = 'name'
): Promise<T[]> {
  return await model.findMany({
    orderBy: { [orderBy]: 'asc' },
  })
}

export async function findById<T>(
  model: any,
  id: string
): Promise<T | null> {
  try {
    return await model.findUnique({
      where: { id },
    })
  } catch (error) {
    return null
  }
}

export async function create<T>(
  model: any,
  data: any
): Promise<T> {
  return await model.create({
    data: data,
  })
}

export async function update<T>(
  model: any,
  id: string,
  data: UpdateData<T>
): Promise<T> {
  return await model.update({
    where: { id },
    data: data,
  })
}

export async function remove<T>(
  model: any,
  id: string
): Promise<T> {
  return await model.delete({
    where: { id },
  })
}
