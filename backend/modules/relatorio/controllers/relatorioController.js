// AQUI apontamos para a pasta "services", e não "usecases"
const relatorioService = require('../application/services/relatorioService');

exports.downloadPDF = async (req, res) => {
  try {
    await relatorioService.gerarPDF(res);
  } catch (error) {
    console.error('Erro ao gerar relatório PDF:', error);
    res.status(500).json({ message: 'Erro ao gerar PDF', error: error.message });
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    await relatorioService.gerarExcel(res);
  } catch (error) {
    console.error('Erro ao gerar relatório Excel:', error);
    res.status(500).json({ message: 'Erro ao gerar Excel', error: error.message });
  }
};
