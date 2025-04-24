require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const ordemRoutes = require('./routes/ordem'); // Já está aqui, perfeito!

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🟢 MongoDB conectado'))
  .catch(err => console.error('🔴 Erro MongoDB:', err));

// Rotas de autenticação
app.use('/api/auth', authRoutes);  // A rota de autenticação será '/api/auth'

// Rotas de ordem de serviço
app.use('/api/ordens', ordemRoutes);  // A rota de ordens será '/api/ordens'

console.log('Rotas de ordens configuradas em /api/ordens');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
