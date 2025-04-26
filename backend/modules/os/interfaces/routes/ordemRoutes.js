const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../middleware/auth');
const ordemController = require('../controllers/ordemController');

router.use(authMiddleware);
router.get('/', ordemController.getTodasOrdens);
router.get('/:id', ordemController.getOrdemPorId);
router.post('/', ordemController.criarOrdem);
router.put('/:id', ordemController.atualizarOrdem);
router.delete('/:id', ordemController.deletarOrdem);

module.exports = router;