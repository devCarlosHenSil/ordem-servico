const mongoose = require('mongoose');

const OrdemDeServicoSchema = new mongoose.Schema({
  cliente: { 
    type: String, 
    required: [true, 'O nome do cliente é obrigatório'] 
  },
  descricao: { 
    type: String, 
    required: [true, 'A descrição do serviço é obrigatória'] 
  },
  status: { 
    type: String, 
    enum: ['aberta', 'em andamento', 'concluída'], 
    default: 'aberta' 
  },
  valor: {
    type: Number,
    required: false // ou true, se quiser tornar obrigatório
  },
  dataCriacao: { 
    type: Date, 
    default: Date.now 
  },
  dataConclusao: { 
    type: Date 
  }
});

module.exports = mongoose.model('OrdemDeServico', OrdemDeServicoSchema);
