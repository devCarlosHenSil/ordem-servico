const { gerarRelatorioExcel } = require('../../infrastructure/relatorioUtils');

/**
 * Gera o relatório em Excel e o envia como resposta HTTP.
 * @param {import('express').Response} res - Objeto de resposta do Express
 */
const gerarExcel = async (res) => {
  try {
    await gerarRelatorioExcel(res);
  } catch (err) {
    console.error('Erro ao gerar relatório Excel:', err);
    // Lança o erro para ser tratado pelo controller
    throw err;
  }
};

module.exports = gerarExcel;
