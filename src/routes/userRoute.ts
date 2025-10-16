
// router (para criar rotas)
import { Router } from 'express'

// Importa TODAS as funções do controller como um objeto
import * as userController from '../controllers/userController'

//cria o router: conjunto de totas
const router = Router()


//rota para criar um novo usuario
router.post('/', userController.criarUsuario)

//rota para estatisticas
router.get('/stats', userController.obterEstatisticas)


router.get('/search', userController.buscarPorTexto)

router.get('/', userController.buscarComFiltros)

//rota para busca por id
router.get('/:id', userController.buscarPorId)

//rota para atualizar um usuario
router.put('/:id', userController.atualizarUsuario)

//rota para deletar um usuario
router.delete('/:id', userController.deletarUsuario)


export default router