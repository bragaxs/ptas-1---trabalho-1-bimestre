import { Room } from '../models/roomModel'
import * as persistenceService from './persistenceService'

export async function criarSala(dados: Omit<Room, 'id' | 'isActive'>): Promise<Room> {
  const salasExistentes = await persistenceService.buscarTodasSalas()
  if (salasExistentes.some(r => r.name.toLowerCase() === dados.name.toLowerCase())) {
    throw new Error(`Já existe uma sala chamada "${dados.name}"`)
  }

  const novoId = await persistenceService.gerarNovoId('rooms.json')
  const novaSala: Room = {
    id: novoId,
    name: dados.name,
    capacity: dados.capacity,
    location: dados.location || '',
    features: dados.features || [],
    isActive: true,
  }

  return await persistenceService.criarSala(novaSala)
}

export async function buscarTodas(): Promise<Room[]> {
  return await persistenceService.buscarTodasSalas()
}

export async function buscarPorId(id: string): Promise<Room | undefined> {
  return await persistenceService.buscarSalaPorId(id)
}

export async function atualizarSala(id: string, dados: Partial<Room>): Promise<Room | undefined> {
  const salaExistente = await persistenceService.buscarSalaPorId(id)
  if (!salaExistente) return undefined

  if (dados.name) {
    const salas = await persistenceService.buscarTodasSalas()
    if (salas.some(r => r.id !== id && r.name.toLowerCase() === dados.name!.toLowerCase())) {
      throw new Error(`O nome "${dados.name}" já está em uso por outra sala`)
    }
  }

  return await persistenceService.atualizarSala(id, { ...salaExistente, ...dados })
}

export async function deletarSala(id: string): Promise<boolean> {
  return await persistenceService.deletarSala(id)
}

export async function buscarAtivas(): Promise<Room[]> {
  const salas = await persistenceService.buscarTodasSalas()
  return salas.filter(s => s.isActive)
}

export async function obterEstatisticas(): Promise<{ total: number; ativas: number; inativas: number }> {
  const salas = await persistenceService.buscarTodasSalas()
  const ativas = salas.filter(s => s.isActive).length
  return { total: salas.length, ativas, inativas: salas.length - ativas }
}
