require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Rotas de autenticação
const authRoutes = require('./modules/auth/interfaces/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Rotas de ordem de serviço
const ordemRoutes = require('./modules/os/interfaces/routes/ordemRoutes');
app.use('/api/ordens', ordemRoutes);

const relatorioRoutes = require('./modules/relatorio/interfaces/routes/relatorioRoutes');
app.use('/api/ordens/relatorio', relatorioRoutes);

// Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));