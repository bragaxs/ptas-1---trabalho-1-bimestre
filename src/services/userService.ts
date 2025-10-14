import { User, createdAt, updatedAt } from '../models/userModel'
import * as persistenceService from './persistenceService'

export async function criarUsuario(dados: createdAt): Promise<User> {
  const usuariosExistentes = await persistenceService.buscarTodosUsuarios()

  if (usuariosExistentes.some(u => u.email.toLowerCase() === dados.email.toLowerCase())) {
    throw new Error(`Email ${dados.email} já está cadastrado`)
  }

  if (usuariosExistentes.some(u => u.registration === dados.registration)) {
    throw new Error(`Registro ${dados.registration} já está cadastrado`)
  }

  const novoId = await persistenceService.gerarNovoId('users.json') // opcional, pode usar ID do persistenceService
  const novoUsuario: User = {
    id: novoId,
    name: dados.name,
    email: dados.email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    role: 'Standard',
    registration: dados.registration,
    isActive: true,
  }

  return await persistenceService.criarUsuario(novoUsuario)
}

export async function buscarTodos(): Promise<User[]> {
  return await persistenceService.buscarTodosUsuarios()
}

export async function buscarPorId(id: string): Promise<User | undefined> {
  return await persistenceService.buscarPorId(id)
}

export async function atualizarUsuario(id: string, dados: updatedAt): Promise<User | undefined> {
  const usuarioExistente = await persistenceService.buscarPorId(id)
  if (!usuarioExistente) return undefined

  // valida email e registration duplicados
  if (dados.email) {
    const usuarios = await persistenceService.buscarTodosUsuarios()
    if (usuarios.some(u => u.id !== id && u.email.toLowerCase() === dados.email!.toLowerCase())) {
      throw new Error(`Email ${dados.email} já está em uso por outro usuário`)
    }
  }
  if (dados.registration) {
    const usuarios = await persistenceService.buscarTodosUsuarios()
    if (usuarios.some(u => u.id !== id && u.registration === dados.registration)) {
      throw new Error(`Matrícula ${dados.registration} já está em uso`)
    }
  }

  return await persistenceService.atualizarUsuario(id, { ...usuarioExistente, ...dados })
}

export async function deletarUsuario(id: string): Promise<boolean> {
  return await persistenceService.deletarUsuario(id)
}

export async function buscarAtivos(): Promise<User[]> {
  return await persistenceService.buscarAtivos()
}

export async function obterEstatisticas(): Promise<{ total: number; ativos: number; inativos: number }> {
  const usuarios = await persistenceService.buscarTodosUsuarios()
  const ativos = usuarios.filter(u => u.isActive).length
  return { total: usuarios.length, ativos, inativos: usuarios.length - ativos }
}
