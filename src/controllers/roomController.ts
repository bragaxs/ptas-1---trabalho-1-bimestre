import { Request, Response } from 'express'
import { Room, createdAt, updatedAt } from '../models/roomModel'
import { roomService } from '../services'



export async function criarSalaController(req: Request, res: Response): Promise<Response> {
  try {
    const dados: createdAt = req.body

   
    if (!dados.name || !dados.capacity) {
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando',
        camposNecessarios: ['name', 'capacity'],
      })
    }

    const novaSala = await roomService.criarSala(dados as Room) //dados as room =  serve para converter o tipo de dados para Room
    return res.status(201).json(novaSala)
  } catch (erro: any) {
    if (erro.message.includes('já está cadastrada') || erro.message.includes('já está em uso')) {
      return res.status(409).json({ erro: erro.message })
    }
    return res.status(500).json({
      erro: 'Erro ao criar sala',
      detalhes: erro.message,
    })
  }
}


export async function buscarTodasSalasController(req: Request, res: Response): Promise<Response> {
  try {
    const salas = await roomService.buscarTodas()
    return res.status(200).json(salas)
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao buscar salas',
      detalhes: erro.message,
    })
  }
}


export async function buscarSalaPorIdController(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const sala = await roomService.buscarPorId(id)

    if (!sala) {
      return res.status(404).json({ erro: `Sala com ID ${id} não encontrada` })
    }

    return res.status(200).json(sala)
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao buscar sala',
      detalhes: erro.message,
    })
  }
}


export async function atualizarSalaController(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const dados: updatedAt = req.body

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ erro: 'Nenhum dado para atualizar foi fornecido' })
    }

    const salaAtualizada = await roomService.atualizarSala(id, dados)

    if (!salaAtualizada) {
      return res.status(404).json({ erro: `Sala com ID ${id} não encontrada` })
    }

    return res.status(200).json(salaAtualizada)
  } catch (erro: any) {
    if (erro.message.includes('já está em uso')) {
      return res.status(409).json({ erro: erro.message })
    }
    return res.status(500).json({
      erro: 'Erro ao atualizar sala',
      detalhes: erro.message,
    })
  }
}


export async function deletarSalaController(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const deletado = await roomService.deletarSala(id)

    if (!deletado) {
      return res.status(404).json({ erro: `Sala com ID ${id} não encontrada` })
    }

    return res.status(200).json({ mensagem: 'Sala deletada com sucesso' })
  } catch (erro: any) {
    return res.status(500).json({
      erro: 'Erro ao deletar sala',
      detalhes: erro.message,
    })
  }
}
