const connectDB = require('../db');

async function getOrdens(req, res) {
  const db = await connectDB();
  const ordens = await db.collection('ordens').find().toArray();
  res.json(ordens);
}

async function criarOrdem(req, res) {
  const db = await connectDB();
  const novaOrdem = req.body;
  const result = await db.collection('ordens').insertOne(novaOrdem);
  res.json(result);
}

module.exports = { getOrdens, criarOrdem };
