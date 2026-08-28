import type { AppData, Asset, HistoryEvent, Task } from './types';
import { blobToBase64, formatDate, formatMoney, safeFilename } from './utils';

export interface PackOptions {
  assetIds: string[];
  includeGeneral: boolean;
  includeTasks: boolean;
  includeAttachments: boolean;
  title: string;
  handoverNote: string;
}

function selected(data: AppData, options: PackOptions): { assets: Asset[]; events: HistoryEvent[]; tasks: Task[] } {
  const ids = new Set(options.assetIds);
  return {
    assets: data.assets.filter((asset) => ids.has(asset.id)),
    events: data.events.filter((event) => ids.has(event.assetId) || (options.includeGeneral && !event.assetId)).sort((a, b) => b.date.localeCompare(a.date)),
    tasks: options.includeTasks ? data.tasks.filter((task) => ids.has(task.assetId) || (options.includeGeneral && !task.assetId)).sort((a, b) => a.dueDate.localeCompare(b.dueDate)) : []
  };
}

function wrap(text: string, length = 88): string[] {
  const words = text.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (`${current} ${word}`.trim().length > length && current) { lines.push(current); current = word; }
    else current = `${current} ${word}`.trim();
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

export async function createPdf(data: AppData, options: PackOptions): Promise<Uint8Array> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const chosen = selected(data, options);
  let page = pdf.addPage([612, 792]);
  let y = 738;
  const ink = rgb(0.04, 0.13, 0.16);
  const aqua = rgb(0.08, 0.52, 0.48);
  const muted = rgb(0.32, 0.43, 0.45);
  const drawLine = (text: string, size = 10, weight = regular, color = ink, indent = 0) => {
    if (y < 56) { page = pdf.addPage([612, 792]); y = 742; }
    const printable = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7E]/g, '-');
    page.drawText(printable, { x: 48 + indent, y, size, font: weight, color, maxWidth: 516 - indent });
    y -= size + 6;
  };
  const paragraph = (text: string, indent = 0) => { for (const line of wrap(text, indent ? 76 : 88)) drawLine(line, 10, regular, ink, indent); y -= 3; };
  page.drawRectangle({ x: 0, y: 752, width: 612, height: 40, color: aqua });
  drawLine(options.title || `${data.home?.name || 'Home'} history pack`, 24, bold, ink);
  drawLine(data.home?.address || 'Address not recorded', 11, regular, muted);
  drawLine(`Prepared ${formatDate(new Date().toISOString())} · ${chosen.assets.length} assets · ${chosen.events.length} history records`, 9, regular, muted);
  y -= 18;
  if (options.handoverNote) { drawLine('Handover note', 14, bold, aqua); paragraph(options.handoverNote); y -= 8; }
  drawLine('Assets', 17, bold, aqua); y -= 3;
  if (!chosen.assets.length) paragraph('No assets were selected.');
  for (const asset of chosen.assets) {
    drawLine(asset.name, 13, bold);
    paragraph([asset.category, asset.location, asset.make, asset.model].filter(Boolean).join(' · '), 12);
    if (asset.serial) drawLine(`Serial: ${asset.serial}`, 9, regular, muted, 12);
    if (asset.installedOn) drawLine(`Installed: ${formatDate(asset.installedOn)}`, 9, regular, muted, 12);
    if (asset.warrantyUntil) drawLine(`Warranty until: ${formatDate(asset.warrantyUntil)}`, 9, regular, muted, 12);
    if (asset.notes) paragraph(asset.notes, 12);
    y -= 7;
  }
  drawLine('Service, repair & permit history', 17, bold, aqua); y -= 3;
  if (!chosen.events.length) paragraph('No history records match this selection.');
  for (const event of chosen.events) {
    const asset = data.assets.find((item) => item.id === event.assetId);
    drawLine(`${formatDate(event.date)}  ${event.title}`, 12, bold);
    drawLine(`${event.kind.toUpperCase()} · ${asset?.name || 'Whole property'}${event.contractor ? ` · ${event.contractor}` : ''}${event.cost !== null ? ` · ${formatMoney(event.cost)}` : ''}`, 9, regular, muted, 12);
    if (event.notes) paragraph(event.notes, 12);
    const attachmentCount = event.attachmentIds.length;
    if (attachmentCount) drawLine(`${attachmentCount} attached file${attachmentCount === 1 ? '' : 's'} listed in the ZIP pack`, 9, regular, muted, 12);
    y -= 7;
  }
  if (options.includeTasks) {
    drawLine('Upcoming work', 17, bold, aqua); y -= 3;
    if (!chosen.tasks.length) paragraph('No tasks match this selection.');
    for (const task of chosen.tasks) drawLine(`${task.complete ? '[Complete]' : '[Due]'} ${formatDate(task.dueDate)}  ${task.title}`, 10, task.complete ? regular : bold);
  }
  drawLine('Record note', 12, bold, aqua); paragraph('This report is a homeowner-maintained record, not legal or regulatory advice. Verify permits, warranties, and compliance with the relevant authority or issuer.');
  return pdf.save();
}

export async function createZip(data: AppData, options: PackOptions): Promise<Blob> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const pdf = await createPdf(data, options);
  const chosen = selected(data, options);
  zip.file('house-history-report.pdf', pdf);
  zip.file('records.json', JSON.stringify({ home: data.home, ...chosen, generatedAt: new Date().toISOString() }, null, 2));
  if (options.includeAttachments) {
    const eventIds = new Set(chosen.events.map((event) => event.id));
    for (const attachment of data.attachments.filter((item) => eventIds.has(item.eventId))) {
      zip.file(`evidence/${safeFilename(attachment.eventId)}-${attachment.name.replace(/[\\/:*?"<>|]/g, '-')}`, await blobToBase64(attachment.blob), { base64: true });
    }
  }
  zip.file('README.txt', 'House History Pack\n\nOpen house-history-report.pdf for the portable report. Original evidence files are in /evidence. records.json contains structured data for future import or audit. Keep private: this pack may contain addresses, serial numbers, invoices, and permits.\n');
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
}
