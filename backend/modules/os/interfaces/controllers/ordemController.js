const ordemService = require('../../application/usecases/ordemService');

exports.getTodasOrdens = async (req, res) => {
  try {
    const ordens = await ordemService.listarOrdens();
    res.status(200).json(ordens);
  } catch (error) {
    console.error('Erro getTodasOrdens:', error);
    res.status(500).json({ error: 'Erro ao buscar ordens de serviço' });
  }
};

exports.getOrdemPorId = async (req, res) => {
  try {
    const ordem = await ordemService.buscarPorId(req.params.id);
    if (!ordem) return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    res.status(200).json(ordem);
  } catch (error) {
    console.error('Erro getOrdemPorId:', error);
    res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
  }
};

exports.criarOrdem = async (req, res) => {
  try {
    const novaOrdem = await ordemService.criarOrdem(req.body);
    res.status(201).json(novaOrdem);
  } catch (error) {
    console.error('Erro criarOrdem:', error);
    if (error.name === 'ValidationError') {
      const erros = {};
      Object.keys(error.errors).forEach(field => { erros[field] = error.errors[field].message; });
      return res.status(400).json({ erros });
    }
    res.status(500).json({ error: 'Erro ao criar ordem de serviço' });
  }
};

exports.atualizarOrdem = async (req, res) => {
  try {
    const ordemAtualizada = await ordemService.atualizarOrdem(req.params.id, req.body);
    if (!ordemAtualizada) return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    res.status(200).json(ordemAtualizada);
  } catch (error) {
    console.error('Erro atualizarOrdem:', error);
    res.status(500).json({ error: 'Erro ao atualizar ordem de serviço' });
  }
};

exports.deletarOrdem = async (req, res) => {
  try {
    const deletada = await ordemService.deletarOrdem(req.params.id);
    if (!deletada) return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    res.status(204).send();
  } catch (error) {
    console.error('Erro deletarOrdem:', error);
    res.status(500).json({ error: 'Erro ao deletar ordem de serviço' });
  }
};