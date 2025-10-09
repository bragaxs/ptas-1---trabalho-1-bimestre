
import { Router } from 'express'
import * as bookingRoute from '../controllers/bookingController'
const router = Router()

//cria reserva
router.post('/', bookingRoute.criarReserva)

//busca todas as reservas
router.get('/all', bookingRoute.buscarTodasReservas)

//busca reserva por id
router.get('/:id', bookingRoute.buscarReservaPorId)

//atualiza reserva
router.put('/:id', bookingRoute.atualizarReserva)

//deleta reserva
router.delete('/:id', bookingRoute.deletarReserva)


export default router