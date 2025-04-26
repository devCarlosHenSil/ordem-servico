const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const OrdemDeServico = require('../../os/domain/OrdemDeServico');
const path = require('path');

// PDF
const gerarRelatorioPDF = async (res) => {
  if (!res || typeof res.setHeader !== 'function') {
    throw new Error('Response object inválido ao gerar PDF');
  }

  const doc = new PDFDocument({ margin: 40 });
  const fileName = 'relatorio_ordens.pdf';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  doc.pipe(res);

  // Logo
  const logoPath = path.join(__dirname, '../../../../assets/logo.png');
  try {
    doc.image(logoPath, { fit: [120, 120], align: 'center' });
  } catch {
    console.warn('⚠️ Logo não carregada (path:', logoPath, ')');
  }

  doc.moveDown();
  doc.fontSize(18).text('Relatório de Ordens de Serviço', { align: 'center' });
  doc.moveDown();

  const ordens = await OrdemDeServico.find();

  ordens.forEach(ordem => {
    doc.fontSize(12).text(`ID: ${ordem._id}`);
    doc.text(`Cliente: ${ordem.cliente.nome || JSON.stringify(ordem.cliente)}`);
    doc.text(`Descrição: ${ordem.defeitoRelatado || ordem.descricao}`);

    // Equipamento
    if (ordem.equipamento) {
      const eq = ordem.equipamento;
      doc.text(`Equipamento: ${eq.tipo} | ${eq.marca} ${eq.modelo} (S/N: ${eq.numeroSerie})`);
    }

    // Peças
    if (Array.isArray(ordem.pecasSubstituidas) && ordem.pecasSubstituidas.length) {
      doc.text(`Peças substituídas: ${ordem.pecasSubstituidas.join(', ')}`);
    }

    // Data de entrada
    if (ordem.dataEntrada) {
      doc.text(`Data de entrada: ${new Date(ordem.dataEntrada).toLocaleDateString()}`);
    }

    // Status colorido
    let status = ordem.status || 'Desconhecido';
    let color = 'black';
    if (status.toLowerCase() === 'aberta') color = 'blue';
    if (status.toLowerCase() === 'em andamento') color = 'orange';
    if (status.toLowerCase() === 'concluída') color = 'green';
    if (status.toLowerCase() === 'cancelada') color = 'red';

    doc.fillColor(color).text(`Status: ${status}`);
    doc.fillColor('black');

    // Valor
    const valor = ordem.valorTotal ?? ordem.valor ?? 0;
    doc.text(`Valor: R$ ${Number(valor).toFixed(2)}`);

    doc.moveDown().text('—'.repeat(40)).moveDown();
  });

  doc.end();
};

// Excel
const gerarRelatorioExcel = async (res) => {
  if (!res || typeof res.setHeader !== 'function') {
    throw new Error('Response object inválido ao gerar Excel');
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ordens de Serviço');

  worksheet.columns = [
    { header: 'ID', key: '_id', width: 30 },
    { header: 'Cliente', key: 'cliente', width: 30 },
    { header: 'Descrição', key: 'descricao', width: 30 },
    { header: 'Equipamento', key: 'equipamento', width: 40 },
    { header: 'Peças', key: 'pecas', width: 30 },
    { header: 'Data Entrada', key: 'dataEntrada', width: 15 },
    { header: 'Status', key: 'status', width: 20 },
    { header: 'Valor (R$)', key: 'valor', width: 15 },
  ];

  // Cabeçalho em negrito e congelar primeira linha
  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  const ordens = await OrdemDeServico.find();

  ordens.forEach(ordem => {
    const equip = ordem.equipamento
      ? `${ordem.equipamento.tipo} | ${ordem.equipamento.marca} ${ordem.equipamento.modelo}`
      : '';
    const pecas = Array.isArray(ordem.pecasSubstituidas)
      ? ordem.pecasSubstituidas.join(', ')
      : '';
    const dataEnt = ordem.dataEntrada
      ? new Date(ordem.dataEntrada).toLocaleDateString()
      : '';

    const valor = ordem.valorTotal ?? ordem.valor ?? 0;
    const lowerStatus = (ordem.status || '').toLowerCase();

    const row = worksheet.addRow({
      _id: ordem._id,
      cliente: ordem.cliente.nome || JSON.stringify(ordem.cliente),
      descricao: ordem.defeitoRelatado || ordem.descricao,
      equipamento: equip,
      pecas,
      dataEntrada: dataEnt,
      status: ordem.status,
      valor: Number(valor).toFixed(2),
    });

    // Cor de fundo por status
    let fillColor = '';
    if (lowerStatus === 'aberta') fillColor = 'ADD8E6';
    if (lowerStatus === 'em andamento') fillColor = 'FFFACD';
    if (lowerStatus === 'concluída') fillColor = '90EE90';
    if (lowerStatus === 'cancelada') fillColor = 'FFCCCB';

    if (fillColor) {
      row.eachCell(cell => {
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
