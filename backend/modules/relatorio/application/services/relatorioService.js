//relatoriService.js
const { gerarRelatorioPDF, gerarRelatorioExcel } = require('../../infrastructure/relatorioUtils');

exports.gerarPDF = res => gerarRelatorioPDF(res);
exports.gerarExcel = res => gerarRelatorioExcel(res);
