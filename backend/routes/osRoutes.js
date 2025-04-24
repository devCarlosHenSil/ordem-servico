const express = require('express');
const router = express.Router();
const { getOrdens, criarOrdem } = require('../controllers/osController');

router.get('/', getOrdens);
router.post('/', criarOrdem);

module.exports = router;