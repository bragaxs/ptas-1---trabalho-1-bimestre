import { promises as fs } from 'fs'
import path from 'path'
import { User } from '../models/userModel'
import { Room } from '../models/roomModel'
import { Booking } from '../models/bookingModel'

interface EntidadeComId {
  id: string
}

export class PersistenceService {
  private USERS_FILE = path.join(__dirname, '../../data/users.json')
  private ROOMS_FILE = path.join(__dirname, '../../data/rooms.json')
  private BOOKINGS_FILE = path.join(__dirname, '../../data/bookings.json')

  // -------------------- MÉTODOS GERAIS --------------------
  private async lerDados<T>(caminhoArquivo: string): Promise<T[]> {
    try {
      const conteudo = await fs.readFile(caminhoArquivo, 'utf-8')
      return JSON.parse(conteudo)
    } catch {
      return []
    }
  }

  private async salvarDados<T>(caminhoArquivo: string, entidades: T[]): Promise<void> {
    const pasta = path.dirname(caminhoArquivo)
    await fs.mkdir(pasta, { recursive: true })
    await fs.writeFile(caminhoArquivo, JSON.stringify(entidades, null, 2), 'utf-8')
  }

  public async gerarNovoId(caminhoArquivo: string): Promise<string> {
    const entidades = await this.lerDados<EntidadeComId>(caminhoArquivo)
    if (!entidades.length) return '1'
    const maiorId = Math.max(...entidades.map(e => parseInt(e.id, 10)))
    return String(maiorId + 1)
  }

  // -------------------- USERS --------------------
  public async getAllUsers(): Promise<User[]> {
    return this.lerDados<User>(this.USERS_FILE)
  }

  public async createUser(user: User): Promise<User> {
    const users = await this.getAllUsers()
    users.push(user)
    await this.salvarDados(this.USERS_FILE, users)
    return user
  }

  public async getUserById(id: string): Promise<User | undefined> {
    const users = await this.getAllUsers()
    return users.find(u => u.id === id)
  }

  public async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const users = await this.getAllUsers()
    const index = users.findIndex(u => u.id === id)
    if (index === -1) return undefined

    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date().toISOString()
    }

    await this.salvarDados(this.USERS_FILE, users)
    return users[index]
  }

  public async deleteUser(id: string): Promise<boolean> {
    const users = await this.getAllUsers()
    const novos = users.filter(u => u.id !== id)
    if (novos.length === users.length) return false

    await this.salvarDados(this.USERS_FILE, novos)
    return true
  }

  public async getActiveUsers(): Promise<User[]> {
    const users = await this.getAllUsers()
    return users.filter(u => u.isActive)
  }

  // -------------------- ROOMS --------------------
  public async getAllRooms(): Promise<Room[]> {
    return this.lerDados<Room>(this.ROOMS_FILE)
  }

  public async createRoom(room: Room): Promise<Room> {
    const rooms = await this.getAllRooms()
    rooms.push(room)
    await this.salvarDados(this.ROOMS_FILE, rooms)
    return room
  }

  public async getRoomById(id: string): Promise<Room | undefined> {
    const rooms = await this.getAllRooms()
    return rooms.find(r => r.id === id)
  }

  public async updateRoom(id: string, data: Partial<Room>): Promise<Room | undefined> {
    const rooms = await this.getAllRooms()
    const index = rooms.findIndex(r => r.id === id)
    if (index === -1) return undefined

    rooms[index] = { ...rooms[index], ...data }
    await this.salvarDados(this.ROOMS_FILE, rooms)

    return rooms[index]
  }

  public async deleteRoom(id: string): Promise<boolean> {
    const rooms = await this.getAllRooms()
    const novos = rooms.filter(r => r.id !== id)
    if (novos.length === rooms.length) return false

    await this.salvarDados(this.ROOMS_FILE, novos)
    return true
  }

  // -------------------- BOOKINGS --------------------
  public async getAllBookings(): Promise<Booking[]> {
    return this.lerDados<Booking>(this.BOOKINGS_FILE)
  }

  public async createBooking(booking: Booking): Promise<Booking> {
    const bookings = await this.getAllBookings()
    bookings.push(booking)
    await this.salvarDados(this.BOOKINGS_FILE, bookings)
    return booking
  }

  public async getBookingById(id: string): Promise<Booking | undefined> {
    const bookings = await this.getAllBookings()
    return bookings.find(b => b.id === id)
  }

  public async updateBooking(id: string, data: Partial<Booking>): Promise<Booking | undefined> {
    const bookings = await this.getAllBookings()
    const index = bookings.findIndex(b => b.id === id)
    if (index === -1) return undefined

    bookings[index] = { ...bookings[index], ...data }
    await this.salvarDados(this.BOOKINGS_FILE, bookings)

    return bookings[index]
  }

  public async deleteBooking(id: string): Promise<boolean> {
    const bookings = await this.getAllBookings()
    const novos = bookings.filter(b => b.id !== id)
    if (novos.length === bookings.length) return false

    await this.salvarDados(this.BOOKINGS_FILE, novos)
    return true
  }

  public async getBookingsByRoom(roomId: string): Promise<Booking[]> {
    const bookings = await this.getAllBookings()
    return bookings.filter(b => b.roomId === roomId)
  }

  public async getBookingsByUser(userId: string): Promise<Booking[]> {
    const bookings = await this.getAllBookings()
    return bookings.filter(b => b.userId === userId)
  }

  public async getBookingsByDate(date: string): Promise<Booking[]> {
    const bookings = await this.getAllBookings()
    return bookings.filter(b => b.date === date)
  }

  public async generateNewBookingId(): Promise<string> {
    return this.gerarNovoId(this.BOOKINGS_FILE)
  }
}
