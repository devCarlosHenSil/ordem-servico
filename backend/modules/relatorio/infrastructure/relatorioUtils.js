//relatorioUtils.js
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const OrdemDeServico = require('../../os/domain/OrdemDeServico');
const path = require('path');

// Função que monta e envia o PDF
async function gerarRelatorioPDF(res) {
  const doc = new PDFDocument({ margin: 40 });
  const fileName = 'relatorio_ordens.pdf';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  doc.pipe(res);

  // tenta carregar logo, se não achar não quebra
  try {
    const logoPath = path.join(__dirname, '../../../../assets/logo.png');
    doc.image(logoPath, { fit: [120, 120], align: 'center' });
  } catch { /* ignora */ }

  doc.moveDown()
     .fontSize(18).text('Relatório de Ordens de Serviço', { align: 'center' })
     .moveDown();

  const ordens = await OrdemDeServico.find();
  ordens.forEach(ordem => {
    doc.fontSize(12).text(`ID: ${ordem._id}`);
    doc.text(`Cliente: ${ordem.cliente}`);
    doc.text(`Descrição: ${ordem.descricao}`);
    // cor por status
    let color = { aberta: 'blue', 'em andamento': 'orange', concluída: 'green' }[ordem.status] || 'black';
    doc.fillColor(color).text(`Status: ${ordem.status}`).fillColor('black');
    // valor formatado
    const v = (!isNaN(ordem.valor) ? ordem.valor : 0).toFixed(2);
    doc.text(`Valor: R$ ${v}`);
    doc.moveDown().text('─'.repeat(30)).moveDown();
  });

  doc.end();
}

// Função que monta e envia o Excel
async function gerarRelatorioExcel(res) {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet('Ordens de Serviço');

  ws.columns = [
    { header: 'ID', key: '_id', width: 30 },
    { header: 'Cliente', key: 'cliente', width: 30 },
    { header: 'Descrição', key: 'descricao', width: 30 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Valor', key: 'valor', width: 15 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: 'frozen', ySplit: 1 }];

  const ordens = await OrdemDeServico.find();
  ordens.forEach(ordem => {
    const v = (!isNaN(ordem.valor) ? ordem.valor : 0).toFixed(2);
    const row = ws.addRow({
      _id: ordem._id,
      cliente: ordem.cliente,
      descricao: ordem.descricao,
      status: ordem.status,
      valor: v,
    });
    // cor de fundo conforme status
    const colors = {
      aberta: 'ADD8E6',
      'em andamento': 'FFFACD',
      concluída: '90EE90'
    };
    const fill = colors[ordem.status];
    if (fill) {
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb: fill }};
        cell.border = {
          top: {style:'thin'}, left:{style:'thin'},
          bottom:{style:'thin'}, right:{style:'thin'}
        };
      });
    }
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition','attachment; filename=relatorio_ordens.xlsx');
  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { gerarRelatorioPDF, gerarRelatorioExcel };
