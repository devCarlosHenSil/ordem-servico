const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const ordemController = require('../controllers/ordemController');

// Aplica o middleware de autenticação a todas as rotas
router.use(authMiddleware);

// Rota para listar todas as ordens
router.get('/', ordemController.getTodasOrdens);

// Rota para obter detalhes de uma ordem específica
router.get('/:id', ordemController.getOrdemPorId);

// Rota para criar uma nova ordem
router.post('/', ordemController.criarOrdem);

// Rota para atualizar uma ordem existente
router.put('/:id', ordemController.atualizarOrdem);

// Rota para deletar uma ordem
router.delete('/:id', ordemController.deletarOrdem);

module.exports = router;
