const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const OrdemDeServico = require('../models/OrdemDeServico');
const path = require('path');

// Função para gerar relatório em PDF
const gerarRelatorioPDF = async (res) => {
  try {
    const doc = new PDFDocument({ margin: 40 });
    const fileName = 'relatorio_ordens.pdf';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    doc.pipe(res);

    // Logo da empresa
    const logoPath = path.join(__dirname, '../assets/logo.png'); // Substitua pelo caminho correto
    doc.image(logoPath, { fit: [120, 120], align: 'center' });

    doc.moveDown();
    doc.fontSize(18).text('Relatório de Ordens de Serviço', { align: 'center' });
    doc.moveDown();

    const ordens = await OrdemDeServico.find();

    ordens.forEach(ordem => {
      doc.fontSize(12).text(`ID: ${ordem._id}`);
      doc.text(`Cliente: ${ordem.cliente}`);
      doc.text(`Descrição: ${ordem.descricao}`);

      // Cor por status
      let status = ordem.status || 'Desconhecido';
      let color = 'black';
      if (status.toLowerCase() === 'aberto') color = 'blue';
      if (status.toLowerCase() === 'em andamento') color = 'orange';
      if (status.toLowerCase() === 'fechado') color = 'green';

      doc.fillColor(color).text(`Status: ${status}`);
      doc.fillColor('black'); // Reset

      // Verifica se o valor é um número válido, senão exibe "Valor não informado"
      const valorNumerico = Number(ordem.valor);
      const valorFormatado = !isNaN(valorNumerico) ? `R$ ${valorNumerico.toFixed(2)}` : 'Valor não informado';
      doc.text(`Valor: ${valorFormatado}`);
      doc.moveDown().text('------------------------------').moveDown();
    });

    doc.end();
  } catch (err) {
    console.error('Erro ao gerar relatório PDF:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro ao gerar o relatório PDF' });
    }
  }
};

// Função para gerar relatório em Excel
const gerarRelatorioExcel = async (res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ordens de Serviço');

  worksheet.columns = [
    { header: 'ID', key: '_id', width: 30 },
    { header: 'Cliente', key: 'cliente', width: 30 },
    { header: 'Descrição', key: 'descricao', width: 30 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Valor', key: 'valor', width: 15 },
  ];

  const ordens = await OrdemDeServico.find();

  ordens.forEach(ordem => {
    // Verifica se o valor é um número válido e formata corretamente, senão coloca "0.00"
    const valorFormatado = !isNaN(ordem.valor) ? ordem.valor.toFixed(2) : '0.00';
    worksheet.addRow({
      _id: ordem._id,
      cliente: ordem.cliente,
      descricao: ordem.descricao,
      status: ordem.status,
      valor: valorFormatado,
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ordens.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { gerarRelatorioPDF, gerarRelatorioExcel };
