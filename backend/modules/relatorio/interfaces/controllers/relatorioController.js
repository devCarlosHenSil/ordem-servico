const relatorioService = require('../../application/services/relatorioService');

const downloadPDF = async (req, res) => {
  try {
    const buffer = await relatorioService.gerarPDF();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio.pdf"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar PDF', error: error.message });
  }
};

const downloadExcel = async (req, res) => {
  try {
    const buffer = await relatorioService.gerarExcel();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="relatorio.xlsx"');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao gerar Excel', error: error.message });
  }
};

module.exports = {
  downloadPDF,
  downloadExcel
};
