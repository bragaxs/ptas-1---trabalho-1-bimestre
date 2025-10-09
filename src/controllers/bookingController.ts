import { createdAt, updatedAt, Booking } from '../models/bookingModel'
import { bookingService } from '../services'
import { Request, Response } from 'express'


export async function criarReserva(req: Request, res: Response): Promise<Response> {
  try {
    const dados: createdAt = req.body

    if (!dados.roomId || !dados.userId || !dados.startTime || !dados.endTime) {
      return res.status(400).json({
        erro: 'Campos obrigatórios faltando',
        camposNecessarios: ['roomId', 'userId', 'start', 'end'],
      })
    }

    const novaReserva = await bookingService.criarReserva(dados as Booking) //dados as Booking = serve para converter o tipo de dados para Booking
    return res.status(201).json(novaReserva)
  } catch (erro: any) {
    if (erro.message.includes('Conflito de horário')) {
      return res.status(409).json({ erro: erro.message })
    }
    return res.status(500).json({ erro: 'Erro ao criar reserva', detalhes: erro.message })
  }
}

export async function buscarTodasReservas(req: Request, res: Response): Promise<Response> {
  try {
    const reservas = await bookingService.buscarTodas()
    return res.status(200).json(reservas)
  } catch (erro: any) {
    return res.status(500).json({ erro: 'Erro ao buscar reservas', detalhes: erro.message })
  }
}

export async function buscarReservaPorId(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const reserva = await bookingService.buscarPorId(id)

    if (!reserva) {
      return res.status(404).json({ erro: `Reserva com ID ${id} não encontrada` })
    }

    return res.status(200).json(reserva)
  } catch (erro: any) {
    return res.status(500).json({ erro: 'Erro ao buscar reserva', detalhes: erro.message })
  }
}

export async function atualizarReserva(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const dados: updatedAt = req.body

    if (Object.keys(dados).length === 0) {
      return res.status(400).json({ erro: 'Nenhum dado para atualizar foi fornecido' })
    }

    const reservaAtualizada = await bookingService.atualizarReserva(id, dados)

    if (!reservaAtualizada) {
      return res.status(404).json({ erro: `Reserva com ID ${id} não encontrada` })
    }

    return res.status(200).json(reservaAtualizada)
  } catch (erro: any) {
    if (erro.message.includes('Conflito de horário')) {
      return res.status(409).json({ erro: erro.message })
    }
    return res.status(500).json({ erro: 'Erro ao atualizar reserva', detalhes: erro.message })
  }
}

export async function deletarReserva(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params
    const deletado = await bookingService.deletarReserva(id)

    if (!deletado) {
      return res.status(404).json({ erro: `Reserva com ID ${id} não encontrada` })
    }

    return res.status(200).json({ mensagem: 'Reserva deletada com sucesso' })
  } catch (erro: any) {
    return res.status(500).json({ erro: 'Erro ao deletar reserva', detalhes: erro.message })
  }
}