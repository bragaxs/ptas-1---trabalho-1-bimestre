/**
 * 🎓 STUDENT.SERVICE.TS - Serviço de Lógica de Negócio para Estudantes
 *
 * Este arquivo contém as regras de negócio relacionadas a estudantes.
 * Validações, verificações de unicidade, etc.
 */

// ========================================
// IMPORTAÇÕES
// ========================================

// Importa os tipos necessários
import { User, createdAt, updatedAt } from '../models/userModel'

// Importa as funções de persistência
import * as persistenceService from './persistenceService'

// ========================================
// FUNÇÕES DO SERVIÇO
// ========================================

/**
 * ➕ criarEstudante - Cria um novo estudante com validações
 *
 * @param dados - Dados do estudante a criar
 * @returns Promise com o estudante criado
 * @throws Error se validação falhar
 */
export async function criarUsuario(dados: createdAt): Promise<User> {
  // ========================================
  // 1. VALIDAR UNICIDADE DE EMAIL
  // ========================================

  // Busca todos os usuários
  const usuariosExistentes: User[] = await persistenceService.buscarTodosUsuarios()

  // Verifica se já existe usuário com este email
  const emailExiste = usuariosExistentes.some(
    (user) => user.email.toLowerCase() === dados.email.toLowerCase(),
  )

  // Se existir, lança erro
  if (emailExiste) {
    throw new Error(`Email ${dados.email} já está cadastrado`)
  }

  // ========================================
  // 2. VALIDAR UNICIDADE DE MATRÍCULA
  // ========================================

  // Verifica se já existe usuário com estes dados
  const registroExiste = usuariosExistentes.some(
    (user) => user.registration === dados.registration,
  )

  // Se existir, lança erro
  if (registroExiste) {
    throw new Error(`Registro ${dados.registration} já está cadastrado`)
  }

  // ========================================
  // 3. GERAR NOVO ID
  // ========================================

    const novoUsuarioCriado = await persistenceService.criarUsuario(dados as User); ///dados as user: faz o typescript entender que é do tipo user sem erros
    
// ========================================
// 4. CRIAR OBJETO USER COMPLETO
// ========================================

const novoUsuario: User = {
  id: novoUsuarioCriado.id, //pega o id que acabou de ser criado, e atribui ao novo usuario
  name: dados.name,
  email: dados.email,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  role: 'Standard',
  registration: dados.registration,
  isActive: true,
}

  // ========================================
  // 5. SALVAR NO BANCO DE DADOS (arquivo JSON)
  // ========================================

  return await persistenceService.criarUsuario(novoUsuario)
}

/**
 * 👥 buscarTodos - Busca todos os estudantes
 *
 * @returns Promise com array de estudantes
 */
export async function buscarTodos(): Promise<User[]> {
  // Simplesmente repassa para a camada de persistência
  return await persistenceService.buscarTodosUsuarios()
}

/**
 * 🔍 buscarPorId - Busca estudante por ID
 *
 * @param id - ID do estudante
 * @returns Promise com estudante ou undefined
 */
export async function buscarPorId(id: string): Promise<User | undefined> {
  return await persistenceService.buscarPorId(id)
}

/**
 * ✏️ atualizarEstudante - Atualiza dados de um estudante
 *
 * @param id - ID do estudante
 * @param dados - Dados a atualizar
 * @returns Promise com estudante atualizado ou undefined
 */
export async function atualizarUsuario(
  id: string,
  dados: updatedAt,
): Promise<User | undefined> {
  // ========================================
  // 1. VERIFICAR SE ESTUDANTE EXISTE
  // ========================================

  const estudanteExiste = await persistenceService.buscarPorId(id)

  if (!estudanteExiste) {
    return undefined
  }

  // ========================================
  // 2. VALIDAR EMAIL SE FORNECIDO
  // ========================================

  if (dados.email) {
    // Busca todos os usuários
    const usuarios = await persistenceService.buscarTodosUsuarios()

    // Verifica se outro usuário já usa este email
    const emailJaUsado = usuarios.some(
      (user) => user.id !== id && user.email.toLowerCase() === dados.email!.toLowerCase(),
    )

    if (emailJaUsado) {
      throw new Error(`Email ${dados.email} já está em uso por outro usuário`)
    }
  }

  // ========================================
  // 3. VALIDAR MATRÍCULA SE FORNECIDA
  // ========================================

  if (dados.registration) {
    const usuarios = await persistenceService.buscarTodosUsuarios()

    const matriculaJaUsada = usuarios.some(
      (user) => user.id !== id && user.registration === dados.registration,
    )

    if (matriculaJaUsada) {
      throw new Error(`Matrícula ${dados.registration} já está em uso`)
    }
  }

  // ========================================
  // 4. ATUALIZAR
  // ========================================

  return await persistenceService.atualizarUsuario(id, dados as User)  /// as serve para que o typescript entenda que é do tipo user sem erros
}

/**
 * 🗑️ deletarUsuario - Remove um usuário
 *
 * @param id - ID do usuário
 * @returns Promise com true se deletou, false caso contrário
 */
export async function deletarUsuario(id: string): Promise<boolean> {
  return await persistenceService.deletarUsuario(id)
}

/**
 * ✅ buscarAtivos - Busca apenas usuários ativos
 *
 * @returns Promise com array de usuários ativos
 */
export async function buscarAtivos(): Promise<User[]> {
  return await persistenceService.buscarAtivos()
}




/**
 * Obtém estatísticas dos usuarios
 *
 * @returns Promise com objeto contendo estatísticas
 */
export async function obterEstatisticas(): Promise<{
  total: number
  ativos: number
  inativos: number
}> {
  // Busca todos os usuários
  const usuarios = await persistenceService.buscarTodosUsuarios()

  // Conta ativos
  const ativos = usuarios.filter((e) => e.isActive).length

  // Retorna estatísticas
  return {
    total: usuarios.length, // Total de usuários
    ativos: ativos, // Quantos estão ativos
    inativos: usuarios.length - ativos, // Quantos estão inativos
  }
}