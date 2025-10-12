/**
 * 📅 BOOKING.SERVICE.TS - Serviço de Lógica de Negócio para Reservas
 *
 * Este arquivo contém as regras de negócio relacionadas a reservas.
 * Faz validações e repassa chamadas para o persistenceService.
 */

// ========================================
// IMPORTAÇÕES
// ========================================
import { Booking } from '../models/bookingModel'
import * as persistenceService from './persistenceService'

// ========================================
// FUNÇÕES DO SERVIÇO
// ========================================

/**
 * ➕ criarReserva - Cria uma nova reserva com validações
 *
 * @param dados - Dados da reserva a criar
 * @returns Promise com a reserva criada
 * @throws Error se houver conflito de horário
 */
export async function criarReserva(dados: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
  // 1️⃣ Buscar todas as reservas existentes
  const reservasExistentes: Booking[] = await persistenceService.buscarTodasReservas()

  
  // 3️⃣ Gerar novo ID incremental
  const novoId = await persistenceService.obterNovoIdReserva()

  // 4️⃣ Criar objeto de reserva
  const novaReserva: Booking = {
    id: novoId,
    roomId: dados.roomId,
    userId: dados.userId,
    date: dados.date,
    startTime: dados.startTime,
    endTime: dados.endTime,
    title: dados.title,
    description: dados.description || '',
    status: dados.status || 'Pending',

  }

  // 5️⃣ Salvar no arquivo JSON via camada de persistência
  return await persistenceService.criarReserva(novaReserva)
}

/**
 * 👀 buscarTodas - Retorna todas as reservas cadastradas
 */
export async function buscarTodas(): Promise<Booking[]> {
  return await persistenceService.buscarTodasReservas()
}

/**
 * 🔍 buscarPorId - Busca reserva pelo ID
 */
export async function buscarPorId(id: string): Promise<Booking | undefined> {
  return await persistenceService.buscarReservaPorId(id)
}

/**
 * ✏️ atualizarReserva - Atualiza dados de uma reserva
 */
export async function atualizarReserva(
  id: string,
  dados: Partial<Booking>,
): Promise<Booking | undefined> {
  const reservaExistente = await persistenceService.buscarReservaPorId(id)
  if (!reservaExistente) return undefined




  // Atualiza os campos
  const reservaAtualizada: Booking = {
    ...reservaExistente,
    ...dados,

  }

  // Salva no persistenceService
  return await persistenceService.atualizarReserva(id, reservaAtualizada)
}

/**
 * 🗑️ deletarReserva - Remove uma reserva
 */
export async function deletarReserva(id: string): Promise<boolean> {
  return await persistenceService.deletarReserva(id)
}

/**
 * 🔍 buscarPorSala - Retorna reservas de uma sala específica
 */
export async function buscarPorSala(roomId: string): Promise<Booking[]> {
  return await persistenceService.buscarReservasPorSala(roomId)
}

/**
 * 🔍 buscarPorUsuario - Retorna reservas de um usuário específico
 */
export async function buscarPorUsuario(userId: string): Promise<Booking[]> {
  return await persistenceService.buscarReservasPorUsuario(userId)
}

/**
 * 🔍 buscarPorData - Retorna reservas em uma data específica
 */
export async function buscarPorData(data: string): Promise<Booking[]> {
  return await persistenceService.buscarReservasPorData(data)
}

/**
 * 📊 obterEstatisticas - Estatísticas das reservas
 */
export async function obterEstatisticas(): Promise<{
  total: number
}> {
  const reservas = await persistenceService.buscarTodasReservas()
  return { total: reservas.length }
}
