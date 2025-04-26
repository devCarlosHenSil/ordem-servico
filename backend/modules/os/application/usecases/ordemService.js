// backend/modules/os/application/usecases/ordemService.js

// Ajuste o caminho para o seu modelo de OS
const OrdemDeServico = require('../../domain/OrdemDeServico');

const criarOrdem = async (dados) => {
  const ordem = new OrdemDeServico(dados);
  return await ordem.save();
};

const listarOrdens = async () => {
  return await OrdemDeServico.find();
};

const buscarPorId = async (id) => {
  return await OrdemDeServico.findById(id);
};

const atualizarOrdem = async (id, dados) => {
  return await OrdemDeServico.findByIdAndUpdate(id, dados, { new: true });
};

const deletarOrdem = async (id) => {
  return await OrdemDeServico.findByIdAndDelete(id);
};

module.exports = {
  criarOrdem,
  listarOrdens,
  buscarPorId,
  atualizarOrdem,
  deletarOrdem
};
