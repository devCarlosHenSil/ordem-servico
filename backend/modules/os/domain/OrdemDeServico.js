// backend/modules/os/domain/OrdemDeServico.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Subdocumento para informações do cliente
const clienteSchema = new Schema({
  nome:    { type: String, required: [true, 'O nome do cliente é obrigatório'] },
  contato: { type: String, required: [true, 'O contato do cliente é obrigatório'] },
  endereco:{ type: String, required: [true, 'O endereço do cliente é obrigatório'] }
}, { _id: false });

// Subdocumento para informações do equipamento
const equipamentoSchema = new Schema({
  tipo:        { type: String, required: [true, 'O tipo de equipamento é obrigatório'] },
  marca:       { type: String, required: [true, 'A marca do equipamento é obrigatória'] },
  modelo:      { type: String, required: [true, 'O modelo do equipamento é obrigatório'] },
  numeroSerie: { type: String, required: [true, 'O número de série do equipamento é obrigatório'] }
}, { _id: false });

// Esquema principal da Ordem de Serviço
const ordemDeServicoSchema = new Schema({
  cliente:            { type: clienteSchema,    required: true },
  descricao:          { type: String,           required: [true, 'A descrição do serviço é obrigatória'] },
  equipamento:        { type: equipamentoSchema,required: true },
  defeitoRelatado:    { type: String,           required: [true, 'O defeito relatado é obrigatório'] },
  diagnostico:        { type: String },
  servicosExecutados: { type: String },
  pecasSubstituidas:  [{ type: String }],
  status:             { 
    type: String, 
    enum: ['Aberta','Em andamento','Concluída','Cancelada'], 
    default: 'Aberta' 
  },
  dataEntrada:        { type: Date,             default: Date.now },
  dataConclusao:      { type: Date },
  valorTotal:         { type: Number,           required: [true, 'O valor total é obrigatório'] }
}, {
  timestamps: true
});

// Guarda contra overwrite em múltiplas compilações
module.exports = mongoose.models.OrdemDeServico 
  || mongoose.model('OrdemDeServico', ordemDeServicoSchema);
