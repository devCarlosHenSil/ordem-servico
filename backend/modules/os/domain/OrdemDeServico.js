const mongoose = require('mongoose');

const OrdemDeServicoSchema = new mongoose.Schema({
  cliente: {
    nome: { type: String, required: true },
    contato: { type: String },
    endereco: { type: String }
  },
  equipamento: {
    tipo: { type: String, required: true },
    marca: { type: String },
    modelo: { type: String },
    numeroSerie: { type: String }
  },
  defeitoRelatado: { type: String, required: true },
  diagnostico: { type: String },
  servicosExecutados: { type: String },
  pecasSubstituidas: [{ type: String }],
  status: {
    type: String,
    enum: ['Aberta', 'Em andamento', 'Concluída', 'Cancelada'],
    default: 'Aberta'
  },
  dataEntrada: { type: Date, default: Date.now },
  dataConclusao: { type: Date },
  valorTotal: { type: Number }
});

module.exports = mongoose.model('OrdemDeServico', OrdemDeServicoSchema);
