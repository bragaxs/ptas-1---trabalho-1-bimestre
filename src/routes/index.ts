
// IMPORTAÇÕES


import { Router } from 'express'

// Importa as rotas de estudantes
import userRoutes from './userRoute'
import roomRoutes from './roomRoute'
import bookingRoutes from './bookingRoute'

// CRIAR ROUTER PRINCIPAL

const router = Router()

// DEFINIR ROTAS
router.use('/user', userRoutes)
router.use('/room', roomRoutes)
router.use('/booking', bookingRoutes)



export default router