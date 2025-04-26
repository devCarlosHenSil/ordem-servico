const { gerarRelatorioPDF, gerarRelatorioExcel } = require('../../infrastructure/relatorioUtils');

exports.gerarPDF = async (res) => {
  return gerarRelatorioPDF(res);
};

exports.gerarExcel = async (res) => {
  return gerarRelatorioExcel(res);
};
