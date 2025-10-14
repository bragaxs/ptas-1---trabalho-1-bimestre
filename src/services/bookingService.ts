import { Booking } from '../models/bookingModel'
import * as persistenceService from './persistenceService'

export async function criarReserva(dados: Omit<Booking, 'id'>): Promise<Booking> {
  const reservasExistentes = await persistenceService.buscarTodasReservas()
  const novoId = await persistenceService.obterNovoIdReserva()
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

  return await persistenceService.criarReserva(novaReserva)
}

export async function buscarTodas(): Promise<Booking[]> {
  return await persistenceService.buscarTodasReservas()
}

export async function buscarPorId(id: string): Promise<Booking | undefined> {
  return await persistenceService.buscarReservaPorId(id)
}

export async function atualizarReserva(id: string, dados: Partial<Booking>): Promise<Booking | undefined> {
  const reservaExistente = await persistenceService.buscarReservaPorId(id)
  if (!reservaExistente) return undefined
  const reservaAtualizada = { ...reservaExistente, ...dados }
  return await persistenceService.atualizarReserva(id, reservaAtualizada)
}

export async function deletarReserva(id: string): Promise<boolean> {
  return await persistenceService.deletarReserva(id)
}

export async function buscarPorSala(roomId: string): Promise<Booking[]> {
  return await persistenceService.buscarReservasPorSala(roomId)
}

export async function buscarPorUsuario(userId: string): Promise<Booking[]> {
  return await persistenceService.buscarReservasPorUsuario(userId)
}

export async function buscarPorData(data: string): Promise<Booking[]> {
  return await persistenceService.buscarReservasPorData(data)
}

export async function obterEstatisticas(): Promise<{ total: number }> {
  const reservas = await persistenceService.buscarTodasReservas()
  return { total: reservas.length }
}
