/**
 * 🏢 ROOM.SERVICE.TS - Serviço de Lógica de Negócio para Salas
 *
 * Este arquivo contém as regras de negócio relacionadas a salas.
 * Faz validações e repassa chamadas para o persistenceService.
 */

// ========================================
// IMPORTAÇÕES
// ========================================
import { Room } from '../models/roomModel'
import * as persistenceService from './persistenceService'

// ========================================
// FUNÇÕES DO SERVIÇO
// ========================================

/**
 * ➕ criarSala - Cria uma nova sala com validações
 *
 * @param dados - Dados da sala a criar
 * @returns Promise com a sala criada
 * @throws Error se validação falhar
 */
export async function criarSala(dados: Omit<Room, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<Room> {
  // 1️⃣ Buscar todas as salas existentes
  const salasExistentes: Room[] = await persistenceService.buscarTodasSalas()

  // 2️⃣ Verificar se já existe uma sala com o mesmo nome
  const nomeExiste = salasExistentes.some(
    (room) => room.name.toLowerCase() === dados.name.toLowerCase(),
  )

  if (nomeExiste) {
    throw new Error(`Já existe uma sala chamada "${dados.name}"`)
  }

  // 3️⃣ Gerar um novo ID incremental (baseado no arquivo JSON)
  const novoId = String(salasExistentes.length + 1)

  // 4️⃣ Criar objeto da nova sala com timestamps
  const novaSala: Room = {
    id: novoId,
    name: dados.name,
    capacity: dados.capacity,
    location: dados.location || '',
    features: dados.features || [],
    isActive: true,

  }

  // 5️⃣ Salvar no arquivo JSON via camada de persistência
  return await persistenceService.criarSala(novaSala)
}

/**
 * 👀 buscarTodas - Retorna todas as salas cadastradas
 */
export async function buscarTodas(): Promise<Room[]> {
  return await persistenceService.buscarTodasSalas()
}

/**
 * 🔍 buscarPorId - Busca sala pelo ID
 */
export async function buscarPorId(id: string): Promise<Room | undefined> {
  const salas = await persistenceService.buscarTodasSalas()
  return salas.find((r) => r.id === id)
}

/**
 * ✏️ atualizarSala - Atualiza dados de uma sala
 */
export async function atualizarSala(
  id: string,
  dados: Partial<Room>,
): Promise<Room | undefined> {
  const salas = await persistenceService.buscarTodasSalas()
  const indice = salas.findIndex((r) => r.id === id)

  if (indice === -1) return undefined

  // Verifica se o novo nome já está em uso
  if (dados.name) {
    const nomeJaUsado = salas.some(
      (r) => r.id !== id && r.name.toLowerCase() === dados.name!.toLowerCase(),
    )
    if (nomeJaUsado) throw new Error(`O nome "${dados.name}" já está em uso por outra sala`)
  }

  // Atualiza os campos
  salas[indice] = {
    ...salas[indice],
    ...dados,
  }

  // Salva novamente usando o persistenceService
  await persistenceService.criarSala(salas[indice]) // ou atualizarSala, se você criar essa função
  return salas[indice]
}

/**
 * 🗑️ deletarSala - Remove uma sala
 */
export async function deletarSala(id: string): Promise<boolean> {
  const salas = await persistenceService.buscarTodasSalas()
  const novas = salas.filter((r) => r.id !== id)
  if (novas.length === salas.length) return false

  const { promises: fs } = await import('fs')
  const path = await import('path')
  const caminho = path.join(__dirname, '../../data/rooms.json')

  await fs.writeFile(caminho, JSON.stringify(novas, null, 2), 'utf-8')
  return true
}

/**
 * ✅ buscarAtivas - Busca apenas salas ativas
 */
export async function buscarAtivas(): Promise<Room[]> {
  const salas = await persistenceService.buscarTodasSalas()
  return salas.filter((r) => r.isActive)
}

/**
 * 📊 obterEstatisticas - Estatísticas das salas
 */
export async function obterEstatisticas(): Promise<{
  total: number
  ativas: number
  inativas: number
}> {
  const salas = await persistenceService.buscarTodasSalas()
  const ativas = salas.filter((r) => r.isActive).length

  return {
    total: salas.length,
    ativas,
    inativas: salas.length - ativas,
  }
}
