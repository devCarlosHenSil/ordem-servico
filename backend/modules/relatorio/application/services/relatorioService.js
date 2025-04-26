const { gerarRelatorioPDF, gerarRelatorioExcel } = require('../../infrastructure/relatorioUtils');

exports.gerarPDF = async (res) => await gerarRelatorioPDF(res);
exports.gerarExcel = async (res) => await gerarRelatorioExcel(res);
  