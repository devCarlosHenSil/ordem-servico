//relatorioRoutes.js

const express = require('express');
const router  = express.Router();
const auth    = require('../../../middleware/auth');
const ctrl    = require('../controllers/relatorioController');

router.use(auth);

router.get('/pdf',   ctrl.downloadPDF);
router.get('/excel', ctrl.downloadExcel);

module.exports = router;

