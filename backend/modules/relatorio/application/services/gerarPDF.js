const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../../middleware/auth');
const relatorioController = require('../../../relatorio/controllers/relatorioController');

// Protege todas as rotas de relatório
router.use(authMiddleware);

// GET /api/ordens/relatorio/pdf → gera e faz download do PDF
router.get('/pdf', relatorioController.downloadPDF);

// GET /api/ordens/relatorio/excel → gera e faz download do Excel
router.get('/excel', relatorioController.downloadExcel);

module.exports = router;
