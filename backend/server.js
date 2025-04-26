const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // ⬅ conexão com Mongoose

// Rotas
const authRoutes = require('./modules/auth/interfaces/routes/authRoutes');
app.use('/api/auth', authRoutes);

// (demais rotas...)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
