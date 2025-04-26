const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const OrdemDeServico = require('../../os/domain/OrdemDeServico');
const path = require('path');

// PDF
const gerarRelatorioPDF = async (res) => {
  const doc = new PDFDocument({ margin: 40 });
  const fileName = 'relatorio_ordens.pdf';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  doc.pipe(res);

  const logoPath = path.join(__dirname, '../../../../assets/logo.png');
  try {
    doc.image(logoPath, { fit: [120, 120], align: 'center' });
  } catch (err) {
    console.warn('⚠️ Logo não encontrada ou não carregada.');
  }

  doc.moveDown();
  doc.fontSize(18).text('Relatório de Ordens de Serviço', { align: 'center' });
  doc.moveDown();

  const ordens = await OrdemDeServico.find();

  ordens.forEach(ordem => {
    doc.fontSize(12).text(`ID: ${ordem._id}`);
    doc.text(`Cliente: ${ordem.cliente.nome || ordem.cliente}`);
    doc.text(`Descrição: ${ordem.defeitoRelatado || ordem.descricao}`);

    let status = ordem.status || 'Desconhecido';
    let color = 'black';
    if (status.toLowerCase() === 'aberta') color = 'blue';
    if (status.toLowerCase() === 'em andamento') color = 'orange';
    if (status.toLowerCase() === 'concluída') color = 'green';
    if (status.toLowerCase() === 'cancelada') color = 'red';

    doc.fillColor(color).text(`Status: ${status}`);
    doc.fillColor('black');

    const valor = ordem.valorTotal || ordem.valor || 0;
    const valorFormatado = !isNaN(valor) ? `R$ ${Number(valor).toFixed(2)}` : 'Valor não informado';
    doc.text(`Valor: ${valorFormatado}`);
    doc.moveDown().text('------------------------------').moveDown();
  });

  doc.end();
};

// Excel
const gerarRelatorioExcel = async (res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ordens de Serviço');

  worksheet.columns = [
    { header: 'ID', key: '_id', width: 30 },
    { header: 'Cliente', key: 'cliente', width: 30 },
    { header: 'Descrição', key: 'descricao', width: 30 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Valor (R$)', key: 'valor', width: 15 },
  ];

  // Estilo do cabeçalho
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  const ordens = await OrdemDeServico.find();

  ordens.forEach(ordem => {
    const valor = ordem.valorTotal || ordem.valor || 0;
    const status = ordem.status?.toLowerCase();

    const row = worksheet.addRow({
      _id: ordem._id,
      cliente: ordem.cliente.nome || ordem.cliente,
      descricao: ordem.defeitoRelatado || ordem.descricao,
      status: ordem.status,
      valor: Number(valor).toFixed(2),
    });

    // Cores por status
    let fillColor = '';
    if (status === 'aberta') fillColor = 'ADD8E6';
    if (status === 'em andamento') fillColor = 'FFFACD';
    if (status === 'concluída') fillColor = '90EE90';
    if (status === 'cancelada') fillColor = 'FFCCCB';

    if (fillColor) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor }
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ordens.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};

module.exports = { gerarRelatorioPDF, gerarRelatorioExcel };
