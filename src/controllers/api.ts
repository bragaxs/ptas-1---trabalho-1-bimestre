/**
 * 🎮 STUDENT.CONTROLLER.TS - Controlador de Estudantes
 *
 * Este arquivo contém as funções que respondem às requisições HTTP.
 * Cada função é responsável por um endpoint da API.
 */

// IMPORTAÇÕES
// Request e Response são tipos do Express
// Request = dados que vêm do cliente
// Response = resposta que enviamos ao cliente
import { Request, Response } from 'express'

// Importa os tipos necessários
import { createdAt, updatedAt, User } from '../models/userModel'

// Importa o serviço de usuários
import { userService } from '../services'

// FUNÇÕES CONTROLADORAS
/**
 * ➕ criarUsuario - POST /api/users
 *
 * Cria um novo usuário
 *
 * @param req - Requisição HTTP (contém dados no body)
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function criarUsuario(req: Request, res: Response): Promise<Response> {
  try {
    
    // 1. EXTRAIR DADOS DO BODY DA REQUISIÇÃO

    // req.body = dados enviados pelo cliente em JSON
    const dados: createdAt = req.body

    // 2. VALIDAR CAMPOS OBRIGATÓRIOS
    // Verifica se todos os campos necessários foram enviados
    if (!dados.name || !dados.email || !dados.registration || !dados.isActive) {
      // Status 400 = Bad Request (requisição malformada)
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando',
        camposNecessarios: ['name', 'email', 'registration', 'isActive'],
      })
    }

    // 3. CHAMAR O SERVICE PARA CRIAR
    // userService.criarUsuario() faz as validações e salva
    const novoUsuario = await userService.criarUsuario(dados)

    // 4. RETORNAR RESPOSTA DE SUCESSO
    // Status 201 = Created (recurso criado com sucesso)
    // .json() = envia resposta em formato JSON
    return res.status(201).json(novoUsuario)
  } catch (erro: any) {
    // 5. TRATAR ERROS
    // Se erro é de validação (email/matrícula duplicados)
    if (erro.message.includes('já está cadastrad')) {
      // Status 409 = Conflict (conflito, recurso já existe)
      return res.status(409).json({
        erro: erro.message,
      })
    }

    // Erro genérico
    // Status 500 = Internal Server Error
    return res.status(500).json({
      erro: 'Erro ao criar estudante',
      detalhes: erro.message,
    })
  }
}

/**
 * 👥 buscarTodos - GET /api/students
 * Busca todos os estudantes
 * @param req - Requisição HTTP
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function buscarTodos(req: Request, res: Response): Promise<Response> {
  try {
    // Chama o service para buscar todos
    const usuarios = await userService.buscarTodos()

    // Status 200 = OK (sucesso)
    return res.status(200).json(usuarios)
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao buscar usuários',
      detalhes: erro.message,
    })
  }
}

/**
 * 🔍 buscarPorId - GET /api/students/:id
 * Busca um estudante específico pelo ID
 * @param req - Requisição HTTP (ID vem em req.params)
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function buscarPorId(req: Request, res: Response): Promise<Response> {
  try {
    // 1. EXTRAIR ID DA URL
    // req.params = parâmetros da URL
    // Exemplo: /api/students/123 → req.params.id = "123"
    const { id } = req.params

    // 2. BUSCAR USUÁRIO
    const usuario = await userService.buscarPorId(id)

    // 3. VERIFICAR SE ENCONTROU
    if (!usuario) {
      // Status 404 = Not Found (não encontrado)
      return res.status(404).json({
        erro: `Usuário com ID ${id} não encontrado`,
      })
    }

    // 4. RETORNAR USUÁRIO
    return res.status(200).json(usuario)
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao buscar usuário',
      detalhes: erro.message,
    })
  }
}

/**
 * 🔎 buscarComFiltros - GET /api/students?course=X&isActive=true
 * Busca estudantes com filtros opcionais
 * @param req - Requisição HTTP (filtros vêm em req.query)
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function buscarComFiltros(req: Request, res: Response): Promise<Response> {
  try {
    // 1. EXTRAIR PARÂMETROS DE QUERY
    // req.query = parâmetros após ? na URL
    // Exemplo: /api/students?course=ADS&isActive=true
    // → req.query.course = "ADS"
    // → req.query.isActive = "true"
    const { course, isActive } = req.query

    // 2. BUSCAR TODOS OS USUÁRIOS
    let usuarios = await userService.buscarTodos()


    // 4. APLICAR FILTRO DE STATUS (SE FORNECIDO)
    if (isActive !== undefined) {
      // Converte string "true"/"false" para boolean
      const statusFiltro = isActive === 'true'

      // Filtra por status
      usuarios = usuarios.filter((user) => user.isActive === statusFiltro)
    }

    // 5. RETORNAR RESULTADOS FILTRADOS
    return res.status(200).json(usuarios)
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao buscar usuários',
      detalhes: erro.message,
    })
  }
}

/**
 * 🔎 buscarPorTexto - GET /api/students/search?q=texto
 * Busca estudantes por texto (nome, email ou matrícula)
 * @param req - Requisição HTTP
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function buscarPorTexto(req: Request, res: Response): Promise<Response> {
  try {
    // 1. EXTRAIR TEXTO DE BUSCA
    // q = query (termo de busca)
    const { q } = req.query

    // Validar que o parâmetro foi fornecido
    if (!q || typeof q !== 'string') {
      return res.status(400).json({
        erro: 'Parâmetro de busca "q" é obrigatório',
      })
    }

    // 2. BUSCAR TODOS OS USUÁRIOS
    const todosUsuarios = await userService.buscarTodos()

    // 3. FILTRAR POR TEXTO
    // Converte texto de busca para minúsculas
    const textoBusca = q.toLowerCase()

    // Busca em nome, email e matrícula
    const resultados = todosUsuarios.filter(
      (user) =>
        user.name.toLowerCase().includes(textoBusca) ||
        user.email.toLowerCase().includes(textoBusca) ||
        user.registration.toLowerCase().includes(textoBusca),
    )

    // 4. RETORNAR RESULTADOS
    return res.status(200).json(resultados)
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao buscar estudantes',
      detalhes: erro.message,
    })
  }
}

/**
 * ✏️ atualizarEstudante - PUT /api/students/:id
 * Atualiza dados de um estudante
 * @param req - Requisição HTTP (ID em params, dados em body)
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function atualizarUsuario(req: Request, res: Response): Promise<Response> {
  try {
    // 1. EXTRAIR ID E DADOS
    const { id } = req.params
    const dados: updatedAt = req.body

    // 2. VALIDAR QUE ALGO FOI ENVIADO
    // Verifica se pelo menos um campo foi enviado
    if (Object.keys(dados).length === 0) {
      return res.status(400).json({
        erro: 'Nenhum dado para atualizar foi fornecido',
      })
    }

    // 3. CHAMAR SERVICE PARA ATUALIZAR
    const usuarioAtualizado = await userService.atualizarEstudante(id, dados)

    // 4. VERIFICAR SE ENCONTROU
    if (!usuarioAtualizado) {
      return res.status(404).json({
        erro: `Usuário com ID ${id} não encontrado`,
      })
    }

    // 5. RETORNAR USUÁRIO ATUALIZADO
    return res.status(200).json(usuarioAtualizado)
  } catch (erro: any) {
    // Erro de validação (email/registro duplicados)
    if (erro.message.includes('já está em uso')) {
      return res.status(409).json({
        erro: erro.message,
      })
    }

    return res.status(500).json({
      erro: 'Erro ao atualizar estudante',
      detalhes: erro.message,
    })
  }
}

/**
 * 🗑️ deletarEstudante - DELETE /api/students/:id
 *
 * Remove um estudante
 *
 * @param req - Requisição HTTP
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function deletarEstudante(req: Request, res: Response): Promise<Response> {
  try {
    // 1. EXTRAIR ID
    const { id } = req.params

    // 2. CHAMAR SERVICE PARA DELETAR
    const deletado = await userService.deletarUsuario(id)

    // 3. VERIFICAR SE DELETOU
    if (!deletado) {
      return res.status(404).json({
        erro: `Usuário com ID ${id} não encontrado`,
      })
    }

    // 4. RETORNAR CONFIRMAÇÃO
    return res.status(200).json({
      mensagem: 'Usuário deletado com sucesso',
    })
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao deletar usuário',
      detalhes: erro.message,
    })
  }
}

/**
 * 📊 obterEstatisticas 
 *
 * Obtém estatísticas dos usuarios, se esta ativo, inativo
 *
 * @param req - Requisição HTTP
 * @param res - Resposta HTTP
 * @returns Promise com a resposta
 */
export async function obterEstatisticas(req: Request, res: Response): Promise<Response> {
  try {
    // Chama service para calcular estatísticas
    const estatisticas = await userService.obterEstatisticas()

    // Retorna estatísticas
    return res.status(200).json(estatisticas)
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao obter estatísticas',
      detalhes: erro.message,
    })
  }
}