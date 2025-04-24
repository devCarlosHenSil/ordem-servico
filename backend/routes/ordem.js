const express = require('express');
const router = express.Router();
const OrdemDeServico = require('../models/OrdemDeServico');
const authMiddleware = require('../middleware/authMiddleware'); // Importa o middleware

// Aplica o middleware a todas as rotas abaixo
router.use(authMiddleware);

// POST /api/ordens - criar nova OS
router.post('/', async (req, res) => {
  try {
    const ordem = new OrdemDeServico(req.body);
    await ordem.save();
    res.status(201).json(ordem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/ordens - listar todas as OS
router.get('/', async (req, res) => {
  try {
    const ordens = await OrdemDeServico.find();
    res.status(200).json(ordens);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/ordens/:id - obter detalhes de uma OS
router.get('/:id', async (req, res) => {
  try {
    const ordem = await OrdemDeServico.findById(req.params.id);
    if (!ordem) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.status(200).json(ordem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/ordens/:id - atualizar uma OS
router.put('/:id', async (req, res) => {
  try {
    const ordem = await OrdemDeServico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ordem) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.status(200).json(ordem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/ordens/:id - deletar uma OS
router.delete('/:id', async (req, res) => {
  try {
    const ordem = await OrdemDeServico.findByIdAndDelete(req.params.id);
    if (!ordem) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.status(200).json({ message: 'Ordem de serviço deletada com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
