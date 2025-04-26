// backend/modules/relatorio/infrastructure/relatorioUtils.js
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const Ordem = require('../../os/infrastructure/models/ordemModel'); 
const path = require('path');

// Função para gerar relatório em PDF
async function gerarRelatorioPDF(res) {
  const doc = new PDFDocument({ margin: 40 });
  const fileName = 'relatorio_ordens.pdf';

  // cabeçalhos HTTP
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  doc.pipe(res);

  // logo
  const logoPath = path.join(__dirname, '../../../assets/logo.png');
  try {
    doc.image(logoPath, { fit: [120, 120], align: 'center' });
  } catch {
    console.warn('⚠️ Logo não encontrada ou não carregada.');
  }

  doc.moveDown();
  doc.fontSize(18).text('Relatório de Ordens de Serviço', { align: 'center' });
  doc.moveDown();

  const ordens = await Ordem.find();

  ordens.forEach(o => {
    doc.fontSize(12).text(`ID: ${o._id}`);
    doc.text(`Cliente: ${o.cliente.nome}`);
    doc.text(`Contato: ${o.cliente.contato}`);
    doc.text(`Endereço: ${o.cliente.endereco}`);
    doc.text(`Equipamento: ${o.equipamento.tipo} - ${o.equipamento.marca} ${o.equipamento.modelo} (S/N: ${o.equipamento.numeroSerie})`);
    doc.text(`Defeito relatado: ${o.defeitoRelatado}`);
    doc.text(`Diagnóstico: ${o.diagnostico || ''}`);
    doc.text(`Serviços executados: ${o.servicosExecutados || ''}`);
    doc.text(`Peças substituídas: ${o.pecasSubstituidas.join(', ') || ''}`);

    // cor por status
    let status = o.status || 'Desconhecido', color = 'black';
    if (status === 'Aberta') color = 'blue';
    if (status === 'Em andamento') color = 'orange';
    if (status === 'Concluída') color = 'green';
    if (status === 'Cancelada') color = 'red';
    doc.fillColor(color).text(`Status: ${status}`);
    doc.fillColor('black');

    // datas e valor
    const entrada = o.dataEntrada ? new Date(o.dataEntrada).toLocaleDateString() : '';
    const conclusao = o.dataConclusao ? new Date(o.dataConclusao).toLocaleDateString() : '';
    const valor = isNaN(o.valorTotal) ? 0 : o.valorTotal;
    doc.text(`Entrada: ${entrada}`);
    doc.text(`Conclusão: ${conclusao}`);
    doc.text(`Valor total: R$ ${valor.toFixed(2)}`);

    doc.moveDown().text('-----------------------------------------------------').moveDown();
  });

  doc.end();
}

// Função para gerar relatório em Excel
async function gerarRelatorioExcel(res) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Ordens de Serviço');

  // Logo (inserida como imagem na célula A1)
  const logoPath = path.join(__dirname, '../../../assets/logo.png');
  let logoId;
  try {
    logoId = workbook.addImage({
      filename: logoPath,
      extension: 'png',
    });
    worksheet.addImage(logoId, 'A1:D4');
  } catch {
    console.warn('⚠️ Logo não encontrada ou não adicionada ao Excel.');
  }

  // Cabeçalho começa na linha 6
  const headerRow = worksheet.getRow(6);
  const cols = [
    'ID', 'Cliente', 'Contato', 'Endereço',
    'Equipamento', 'Defeito', 'Diagnóstico',
    'Serviços', 'Peças', 'Status',
    'Entrada', 'Conclusão', 'Valor (R$)'
  ];
  worksheet.columns = cols.map(hdr => ({ header: hdr, key: hdr.toLowerCase().replace(/[^a-z]/g,''), width: 20 }));
  headerRow.values = cols;
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD3D3D3' }
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Congela até a linha 6 (logo + cabeçalho)
  worksheet.views = [{ state: 'frozen', ySplit: 6 }];

  // Busca dados
  const ordens = await Ordem.find();

  // Preenche linhas a partir da 7
  ordens.forEach(o => {
    const entrada = o.dataEntrada ? new Date(o.dataEntrada).toLocaleDateString() : '';
    const conclusao = o.dataConclusao ? new Date(o.dataConclusao).toLocaleDateString() : '';
    const valor = isNaN(o.valorTotal) ? 0 : o.valorTotal;

    const row = worksheet.addRow({
      id: o._id.toString(),
      cliente: o.cliente.nome,
      contato: o.cliente.contato,
      endereco: o.cliente.endereco,
      equipamento: `${o.equipamento.tipo} - ${o.equipamento.marca} ${o.equipamento.modelo} (S/N: ${o.equipamento.numeroSerie})`,
      defeito: o.defeitoRelatado,
      diagnostico: o.diagnostico || '',
      servicos: o.servicosExecutados || '',
      pecas: o.pecasSubstituidas.join(', '),
      status: o.status,
      entrada,
      conclusao,
      valor: valor.toFixed(2)
    });

    // cor de fundo por status
    let bg = null;
    if (o.status === 'Aberta') bg = 'ADD8E6';
    if (o.status === 'Em andamento') bg = 'FFFACD';
    if (o.status === 'Concluída') bg = '90EE90';
    if (o.status === 'Cancelada') bg = 'FFCCCB';

    if (bg) {
      row.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern:'solid', fgColor:{ argb: bg } };
      });
    }
  });

  // envia ao client
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_ordens.xlsx');

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { gerarRelatorioPDF, gerarRelatorioExcel };
