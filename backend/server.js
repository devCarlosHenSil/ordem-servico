//server.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const connect = require('./config/database');

const app = express();
app.use(cors());
app.use(express.json());
connect();

app.use('/api/auth',    require('./modules/auth/interfaces/routes/authRoutes'));
app.use('/api/ordens',  require('./modules/os/interfaces/routes/ordemRoutes'));
app.use('/api/ordens/relatorio', require('./modules/relatorio/routes/relatorioRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
