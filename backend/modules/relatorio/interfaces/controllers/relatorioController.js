const relatorioService = require('../../application/services/relatorioService');

// Função para fazer download do PDF
exports.downloadPDF = async (req, res) => {
    try {
      const pdfBuffer = await relatorioService.gerarPDF(); // Gera o conteúdo do PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');
      res.send(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao gerar PDF', error: error.message });
    }
  };
  
  // Função para fazer download do Excel
  exports.downloadExcel = async (req, res) => {
    try {
      const excelBuffer = await relatorioService.gerarExcel();
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=relatorio.xlsx');
      res.send(excelBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao gerar Excel', error: error.message });
    }
  };


