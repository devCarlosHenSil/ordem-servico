const OrdemService = require('../application/usecases/ordemService');

const getTodasOrdens = async (req, res) => {
  try {
    const ordens = await OrdemService.buscarTodas();
    res.status(200).json(ordens);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ordens de serviço' });
  }
};

const getOrdemPorId = async (req, res) => {
  try {
    const ordem = await OrdemService.buscarPorId(req.params.id);
    if (!ordem) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.status(200).json(ordem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ordem de serviço' });
  }
};

const criarOrdem = async (req, res) => {
  try {
    const novaOrdem = await OrdemService.criar(req.body);
    res.status(201).json(novaOrdem);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar ordem de serviço' });
  }
};

const atualizarOrdem = async (req, res) => {
  try {
    const ordemAtualizada = await OrdemService.atualizar(req.params.id, req.body);
    if (!ordemAtualizada) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.status(200).json(ordemAtualizada);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar ordem de serviço' });
  }
};

const deletarOrdem = async (req, res) => {
  try {
    const deletada = await OrdemService.deletar(req.params.id);
    if (!deletada) {
      return res.status(404).json({ error: 'Ordem de serviço não encontrada' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar ordem de serviço' });
  }
};

module.exports = {
  getTodasOrdens,
  getOrdemPorId,
  criarOrdem,
  atualizarOrdem,
  deletarOrdem,
};
