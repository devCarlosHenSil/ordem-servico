const express = require('express');
const router = express.Router();

// Ajuste o path do middleware conforme sua estrutura
const authMiddleware = require('../../../middleware/auth');
const relatorioController = require('../controllers/relatorioController');

// Aplica autenticação
router.use(authMiddleware);

// Rota PDF
// GET /api/ordens/relatorio/pdf
router.get('/pdf', relatorioController.downloadPDF);

// Rota Excel
// GET /api/ordens/relatorio/excel
router.get('/excel', relatorioController.downloadExcel);

module.exports = router;
