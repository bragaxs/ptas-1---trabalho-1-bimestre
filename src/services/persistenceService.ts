/**
 * 💾 PERSISTENCE.SERVICE.TS - Serviço Genérico de Persistência (Reservas de Salas)
 *
 * Este arquivo fornece funções genéricas para ler, salvar e manipular dados JSON
 * e funções específicas para o sistema de reserva de salas (users, rooms, bookings).
 */

// Importa funções de leitura/escrita de arquivos da biblioteca nativa do Node
import { promises as fs } from 'fs'

// Importa funções para manipular caminhos de arquivos (cruzar pastas etc.)
import path from 'path'

// Importa as interfaces (tipos) usadas no sistema — representam as entidades principais
import { User } from '../models/userModel'
import { Room } from '../models/roomModel'
import { Booking } from '../models/bookingModel'

// Interface auxiliar para qualquer entidade que tenha um campo "id"
interface EntidadeComId {
  id: string
}

// ========================================
// FUNÇÕES GENÉRICAS
// ========================================

/**
 * 📖 Lê dados de um arquivo JSON genérico
 */
async function lerDados<T>(caminhoArquivo: string): Promise<T[]> {
  try {
    // Lê o conteúdo do arquivo JSON no caminho informado
    const conteudo = await fs.readFile(caminhoArquivo, 'utf-8')
    // Converte o conteúdo JSON em um array de objetos do tipo genérico T
    return JSON.parse(conteudo)
  } catch {
    // Caso o arquivo não exista ou dê erro, retorna um array vazio
    return []
  }
}

/**
 * 💾 Salva dados em um arquivo JSON
 */
async function salvarDados<T>(
  caminhoArquivo: string, // caminho do arquivo JSON onde os dados serão salvos
  entidades: T[],         // lista de objetos (ex: usuários, salas ou reservas)
): Promise<void> {
  // Garante que a pasta onde o arquivo deve ficar exista (cria se necessário)
  const pasta = path.dirname(caminhoArquivo)
  await fs.mkdir(pasta, { recursive: true })

  // Converte o array de entidades em uma string JSON bonita (indentada)
  const conteudoJson = JSON.stringify(entidades, null, 2)

  // Salva o JSON no arquivo, sobrescrevendo o conteúdo anterior
  await fs.writeFile(caminhoArquivo, conteudoJson, 'utf-8')
}

/**
 * 🆔 Gera novo ID com base no maior existente
 */
async function gerarNovoId(caminhoArquivo: string): Promise<string> {
  // Lê os dados do arquivo e assume que cada item tem um campo "id"
  const entidades = await lerDados<EntidadeComId>(caminhoArquivo)

  // Se o arquivo estiver vazio, começa o ID em "1"
  if (entidades.length === 0) return '1'

  // Procura o maior número de ID existente (convertendo de string → número)
  const maiorId = Math.max(...entidades.map((e) => parseInt(e.id, 10)))

  // Retorna o próximo ID como string (ex: "6" se o maior era "5")
  return String(maiorId + 1)
}

// ========================================
// CAMINHOS DOS ARQUIVOS
// ========================================

// Define os caminhos onde os arquivos JSON ficarão armazenados
const ARQUIVO_USERS = path.join(__dirname, '../../data/users.json')
const ARQUIVO_ROOMS = path.join(__dirname, '../../data/rooms.json')
const ARQUIVO_BOOKINGS = path.join(__dirname, '../../data/bookings.json')

// ========================================
// FUNÇÕES ESPECÍFICAS - USERS
// ========================================

export async function buscarTodosUsuarios(): Promise<User[]> {
  // Retorna todos os usuários lidos do arquivo JSON de usuários
  return await lerDados<User>(ARQUIVO_USERS)
}

export async function criarUsuario(novo: User): Promise<User> {
  // Lê todos os usuários já existentes
  const usuarios = await buscarTodosUsuarios()
  // Adiciona o novo usuário ao array
  usuarios.push(novo)
  // Salva o array atualizado no arquivo
  await salvarDados<User>(ARQUIVO_USERS, usuarios)
  // Retorna o usuário recém-criado
  return novo
}

export async function buscarPorId(id: string): Promise<User | undefined> {
  // Lê todos os usuários
  const usuarios = await buscarTodosUsuarios()
  // Procura um usuário com o ID especificado
  return usuarios.find((u) => u.id === id)
}

export async function deletarUsuario(id: string): Promise<boolean> {
  // Lê todos os usuários
  const usuarios = await buscarTodosUsuarios()
  // Cria uma nova lista sem o usuário de ID informado
  const novos = usuarios.filter((u) => u.id !== id)
  // Se nenhuma reserva foi removida (lista igual), retorna false
  if (novos.length === usuarios.length) return false
  // Salva a nova lista (sem a reserva deletada)
  await salvarDados<User>(ARQUIVO_USERS, novos)
  // Retorna true para indicar sucesso
  return true
}

export async function buscarAtivos(): Promise<User[]> {
  // Lê todos os usuários
  const usuarios = await buscarTodosUsuarios()
  // Filtra apenas os usuários ativos
  return usuarios.filter((u) => u.isActive)
}
//promisse serve para lidar com operações assíncronas, ou seja, operações que podem demorar
export async function atualizarUsuario(id: string, dados: User): Promise<User | undefined> {
  // Lê todos os usuários
  const usuarios = await buscarTodosUsuarios()
  // Encontra o índice do usuário a ser atualizado
  const indice = usuarios.findIndex((u) => u.id === id)
  if (indice === -1) return undefined
  // Atualiza os dados do usuário
  usuarios[indice] = {
    ...usuarios[indice], //... serve para copiar os dados antigos
    ...dados,
    updatedAt: new Date().toISOString(),
  }
  // Salva as alterações
  await salvarDados<User>(ARQUIVO_USERS, usuarios)
  return usuarios[indice]
}

// ========================================
// FUNÇÕES ESPECÍFICAS - ROOMS
// ========================================

export async function buscarTodasSalas(): Promise<Room[]> {
  // Retorna todas as salas cadastradas
  return await lerDados<Room>(ARQUIVO_ROOMS)
}

export async function criarSala(nova: Room): Promise<Room> {
  // Busca todas as salas existentes
  const salas = await buscarTodasSalas()
  // Adiciona a nova sala ao array
  salas.push(nova)
  // Salva a nova lista no arquivo JSON
  await salvarDados<Room>(ARQUIVO_ROOMS, salas)
  // Retorna a sala criada
  return nova
}

// ========================================
// FUNÇÕES ESPECÍFICAS - BOOKINGS (Reservas)
// ========================================

export async function buscarTodasReservas(): Promise<Booking[]> {
  // Lê e retorna todas as reservas
  return await lerDados<Booking>(ARQUIVO_BOOKINGS)
}

export async function buscarReservaPorId(id: string): Promise<Booking | undefined> {
  // Busca todas as reservas
  const reservas = await buscarTodasReservas()
  // Procura uma reserva com o ID especificado
  return reservas.find((b) => b.id === id)
}

export async function criarReserva(novaReserva: Booking): Promise<Booking> {
  // Lê as reservas existentes
  const reservas = await buscarTodasReservas()
  // Adiciona a nova reserva à lista
  reservas.push(novaReserva)
  // Salva tudo novamente no arquivo
  await salvarDados<Booking>(ARQUIVO_BOOKINGS, reservas)
  // Retorna a reserva criada
  return novaReserva
}

export async function atualizarReserva(
  id: string,
  dadosAtualizados: Partial<Booking>, // partial = permite atualizar só alguns campos
): Promise<Booking | undefined> {
  // Busca todas as reservas
  const reservas = await buscarTodasReservas()

  // Encontra o índice da reserva com o ID informado
  const indice = reservas.findIndex((b) => b.id === id)
  if (indice === -1) return undefined // Se não achou, retorna undefined

  // Atualiza os dados da reserva, mantendo os antigos e sobrescrevendo os novos
  reservas[indice] = {
    ...reservas[indice],
    ...dadosAtualizados,
    updatedAt: new Date().toISOString(), // Atualiza o timestamp de modificação
  }

  // Salva o array de reservas atualizado no arquivo
  await salvarDados<Booking>(ARQUIVO_BOOKINGS, reservas)

  // Retorna a reserva já modificada
  return reservas[indice]
}

export async function deletarReserva(id: string): Promise<boolean> {
  // Lê todas as reservas
  const reservas = await buscarTodasReservas()

  // Cria uma nova lista sem a reserva de ID informado
  const novas = reservas.filter((b) => b.id !== id)

  // Se nenhuma reserva foi removida (lista igual), retorna false
  if (novas.length === reservas.length) return false

  // Salva a nova lista (sem a reserva deletada)
  await salvarDados<Booking>(ARQUIVO_BOOKINGS, novas)

  // Retorna true para indicar sucesso
  return true
}

/**
 * 🏢 Buscar reservas de uma sala específica
 */
export async function buscarReservasPorSala(idSala: string): Promise<Booking[]> {
  // Filtra as reservas que pertencem à sala informada
  const reservas = await buscarTodasReservas()
  return reservas.filter((b) => b.roomId === idSala)
}

/**
 * 👤 Buscar reservas feitas por um usuário
 */
export async function buscarReservasPorUsuario(idUsuario: string): Promise<Booking[]> {
  // Filtra as reservas criadas por um usuário específico
  const reservas = await buscarTodasReservas()
  return reservas.filter((b) => b.userId === idUsuario)
}

/**
 * 📅 Buscar reservas por data específica
 */
export async function buscarReservasPorData(data: string): Promise<Booking[]> {
  // Filtra todas as reservas feitas para uma data específica
  const reservas = await buscarTodasReservas()
  return reservas.filter((b) => b.date === data)
}

/**
 * 🆔 Gerar novo ID para reserva
 */
export async function obterNovoIdReserva(): Promise<string> {
  // Chama a função genérica de geração de ID,
  // usando o arquivo específico de reservas
  return await gerarNovoId(ARQUIVO_BOOKINGS)
}

