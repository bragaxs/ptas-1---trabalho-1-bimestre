import { Request, Response } from 'express'

import { User, createdAt, updatedAt } from '../models/userModel'

import { userService } from '../services'

export async function criarUsuario(req: Request, res: Response): Promise<Response> {
  try {
    

    const dados: createdAt = req.body


    if (!dados.name || !dados.email || !dados.registration || !dados.isActive) {
      
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando',
        camposNecessarios: ['name', 'email', 'registration', 'isActive'],
      })
    }

   
    const novoUsuario = await userService.criarUsuario(dados) //await serve para esperar a Promise 


    return res.status(201).json(novoUsuario)
  } catch (erro: any) {
   
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


export async function buscarTodos(req: Request, res: Response): Promise<Response> {
  try {
    
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


export async function buscarPorId(req: Request, res: Response): Promise<Response> {
  try {

    const { id } = req.params

  
    const usuario = await userService.buscarPorId(id)

   
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


export async function buscarComFiltros(req: Request, res: Response): Promise<Response> {
  try {
    // 1. EXTRAIR PARÂMETROS DE FILTRO
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
    const usuarioAtualizado = await userService.atualizarUsuario(id, dados)

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


export async function deletarUsuario(req: Request, res: Response): Promise<Response> {
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

