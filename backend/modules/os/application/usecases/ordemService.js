const OrdemDeServico = require('../../infrastructure/models/ordemModel');

async function criarOrdem(dados) {
  const ordem = new OrdemDeServico(dados);
  return await ordem.save();
}

async function listarOrdens() {
  return await OrdemDeServico.find();
}

async function buscarPorId(id) {
  return await OrdemDeServico.findById(id);
}

async function atualizarOrdem(id, dados) {
  return await OrdemDeServico.findByIdAndUpdate(id, dados, { new: true });
}

async function deletarOrdem(id) {
  return await OrdemDeServico.findByIdAndDelete(id);
}

module.exports = { criarOrdem, listarOrdens, buscarPorId, atualizarOrdem, deletarOrdem };
