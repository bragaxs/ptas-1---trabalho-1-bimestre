
import { Router } from 'express'


import * as roomController from '../controllers/roomController'


// Router() = cria um novo conjunto de rotas
const router = Router()

//cria nova sala
router.post('/', roomController.criarSalaController)

//busca todas as salas
router.get('/search', roomController.buscarTodasSalasController)

 //busca uma sala por ID
router.get('/:id', roomController.buscarSalaPorIdController)

//atualiza uma sala
router.put('/:id', roomController.atualizarSalaController)

//deleta uma sala
router.delete('/:id', roomController.deletarSalaController)


export default router