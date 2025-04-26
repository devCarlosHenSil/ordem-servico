const relatorioService = require('../application/services/relatorioService');

exports.downloadPDF = async (req, res) => {
  try {
    await relatorioService.gerarPDF(res);
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    res.status(500).json({ error: 'Falha ao gerar PDF' });
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    await relatorioService.gerarExcel(res);
  } catch (error) {
    console.error('Erro ao gerar relatório Excel:', error);
    res.status(500).json({ error: 'Falha ao gerar Excel' });
  }
};