const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const secretKey = process.env.JWT_SECRET || 'd0d4f9738e27ae26749736c1227055d41cf7fefae46c60d4ff2d86e36184f263bce2c02b4df889d11f5a172d5f79a8a99298d499c7b92eb86c4084d337a7f965';  // Use uma chave secreta para o JWT

// Registro de usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) return res.status(400).json({ error: 'Usuário já existe' });

    const user = new User({ nome, email, senha });
    await user.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    const senhaValida = await user.compararSenha(senha);
    if (!senhaValida) return res.status(400).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
