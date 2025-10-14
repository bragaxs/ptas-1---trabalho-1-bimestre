import { promises as fs } from 'fs'
import path from 'path'
import { User } from '../models/userModel'
import { Room } from '../models/roomModel'
import { Booking } from '../models/bookingModel'

interface EntidadeComId {
  id: string
}

const ARQUIVO_USERS = path.join(__dirname, '../../data/users.json')
const ARQUIVO_ROOMS = path.join(__dirname, '../../data/rooms.json')
const ARQUIVO_BOOKINGS = path.join(__dirname, '../../data/bookings.json')


async function lerDados<T>(caminhoArquivo: string): Promise<T[]> {
  try {
    const conteudo = await fs.readFile(caminhoArquivo, 'utf-8')
    return JSON.parse(conteudo)
  } catch {
    return []
  }
}

async function salvarDados<T>(caminhoArquivo: string, entidades: T[]): Promise<void> {
  const pasta = path.dirname(caminhoArquivo)
  await fs.mkdir(pasta, { recursive: true })
  await fs.writeFile(caminhoArquivo, JSON.stringify(entidades, null, 2), 'utf-8')
}

export async function gerarNovoId(caminhoArquivo: string): Promise<string> {
  const entidades = await lerDados<EntidadeComId>(caminhoArquivo)
  if (entidades.length === 0) return '1'
  const maiorId = Math.max(...entidades.map(e => parseInt(e.id, 10)))
  return String(maiorId + 1)
}

// -------------------- USERS --------------------

export async function buscarTodosUsuarios(): Promise<User[]> {
  return await lerDados<User>(ARQUIVO_USERS)
}

export async function criarUsuario(usuario: User): Promise<User> {
  const usuarios = await buscarTodosUsuarios()
  usuarios.push(usuario)
  await salvarDados<User>(ARQUIVO_USERS, usuarios)
  return usuario
}

export async function buscarPorId(id: string): Promise<User | undefined> {
  const usuarios = await buscarTodosUsuarios()
  return usuarios.find(u => u.id === id)
}

export async function atualizarUsuario(id: string, usuario: User): Promise<User | undefined> {
  const usuarios = await buscarTodosUsuarios()
  const indice = usuarios.findIndex(u => u.id === id)
  if (indice === -1) return undefined
  usuarios[indice] = { ...usuarios[indice], ...usuario, updatedAt: new Date().toISOString() }
  await salvarDados<User>(ARQUIVO_USERS, usuarios)
  return usuarios[indice]
}

export async function deletarUsuario(id: string): Promise<boolean> {
  const usuarios = await buscarTodosUsuarios()
  const novos = usuarios.filter(u => u.id !== id)
  if (novos.length === usuarios.length) return false
  await salvarDados<User>(ARQUIVO_USERS, novos)
  return true
}

export async function buscarAtivos(): Promise<User[]> {
  const usuarios = await buscarTodosUsuarios()
  return usuarios.filter(u => u.isActive)
}

// -------------------- ROOMS --------------------

export async function buscarTodasSalas(): Promise<Room[]> {
  return await lerDados<Room>(ARQUIVO_ROOMS)
}

export async function criarSala(sala: Room): Promise<Room> {
  const salas = await buscarTodasSalas()
  salas.push(sala)
  await salvarDados<Room>(ARQUIVO_ROOMS, salas)
  return sala
}

export async function buscarSalaPorId(id: string): Promise<Room | undefined> {
  const salas = await buscarTodasSalas()
  return salas.find(r => r.id === id)
}

export async function atualizarSala(id: string, dados: Partial<Room>): Promise<Room | undefined> {
  const salas = await buscarTodasSalas()
  const indice = salas.findIndex(r => r.id === id)
  if (indice === -1) return undefined
  salas[indice] = { ...salas[indice], ...dados }
  await salvarDados<Room>(ARQUIVO_ROOMS, salas)
  return salas[indice]
}

export async function deletarSala(id: string): Promise<boolean> {
  const salas = await buscarTodasSalas()
  const novas = salas.filter(r => r.id !== id)
  if (novas.length === salas.length) return false
  await salvarDados<Room>(ARQUIVO_ROOMS, novas)
  return true
}

// -------------------- BOOKINGS --------------------

export async function buscarTodasReservas(): Promise<Booking[]> {
  return await lerDados<Booking>(ARQUIVO_BOOKINGS)
}

export async function criarReserva(reserva: Booking): Promise<Booking> {
  const reservas = await buscarTodasReservas()
  reservas.push(reserva)
  await salvarDados<Booking>(ARQUIVO_BOOKINGS, reservas)
  return reserva
}

export async function buscarReservaPorId(id: string): Promise<Booking | undefined> {
  const reservas = await buscarTodasReservas()
  return reservas.find(b => b.id === id)
}

export async function atualizarReserva(id: string, dados: Booking): Promise<Booking | undefined> {
  const reservas = await buscarTodasReservas()
  const indice = reservas.findIndex(b => b.id === id)
  if (indice === -1) return undefined
  reservas[indice] = { ...reservas[indice], ...dados }
  await salvarDados<Booking>(ARQUIVO_BOOKINGS, reservas)
  return reservas[indice]
}

export async function deletarReserva(id: string): Promise<boolean> {
  const reservas = await buscarTodasReservas()
  const novas = reservas.filter(b => b.id !== id)
  if (novas.length === reservas.length) return false
  await salvarDados<Booking>(ARQUIVO_BOOKINGS, novas)
  return true
}

export async function buscarReservasPorSala(roomId: string): Promise<Booking[]> {
  const reservas = await buscarTodasReservas()
  return reservas.filter(b => b.roomId === roomId)
}

export async function buscarReservasPorUsuario(userId: string): Promise<Booking[]> {
  const reservas = await buscarTodasReservas()
  return reservas.filter(b => b.userId === userId)
}

export async function buscarReservasPorData(data: string): Promise<Booking[]> {
  const reservas = await buscarTodasReservas()
  return reservas.filter(b => b.date === data)
}

export async function obterNovoIdReserva(): Promise<string> {
  return await gerarNovoId(ARQUIVO_BOOKINGS)
}
