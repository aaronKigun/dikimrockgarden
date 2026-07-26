import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export type BookingPdfRow = {
  id: number;
  name: string;
  email: string;
  room: string;
  amount: number;
  reference: string;
  status: string;
  arrival_date?: string | null;
  created_at: string;
};

const GREEN = {
  deep: [13, 92, 13] as [number, number, number],
  mid: [46, 125, 50] as [number, number, number],
  soft: [232, 245, 233] as [number, number, number],
  line: [200, 230, 201] as [number, number, number],
  ink: [26, 46, 26] as [number, number, number],
  muted: [110, 125, 110] as [number, number, number],
};

async function loadRealLogo(): Promise<string | null> {
  try {
    const res = await fetch('/images/Reallogo.jpg');
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function formatArrival(date?: string | null) {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return date;
  }
}

function formatMoney(amount: number) {
  return `₦${Number(amount || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
}

/** Build a clean, branded bookings PDF using Reallogo.jpg only. */
export async function buildBookingsPdf(bookings: BookingPdfRow[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const stamp = new Date().toLocaleString('en-NG', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const fileStamp = new Date().toISOString().slice(0, 10);
  const filename = `dikim-bookings-${fileStamp}.pdf`;

  const totalRevenue = bookings.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
  const successCount = bookings.filter((tx) => String(tx.status).toLowerCase() === 'success').length;

  // Page background wash
  doc.setFillColor(252, 254, 252);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top accent bar
  doc.setFillColor(...GREEN.deep);
  doc.rect(0, 0, pageWidth, 3.2, 'F');

  // Header block
  const logoData = await loadRealLogo();
  const logoSize = 22;
  const logoX = marginX;
  const logoY = 10;

  if (logoData) {
    // White circular plate behind circular logo
    doc.setFillColor(255, 255, 255);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 1.2, 'F');
    doc.setDrawColor(...GREEN.line);
    doc.setLineWidth(0.4);
    doc.circle(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + 1.2, 'S');
    doc.addImage(logoData, 'JPEG', logoX, logoY, logoSize, logoSize);
  }

  const titleX = logoData ? logoX + logoSize + 8 : marginX;

  doc.setTextColor(...GREEN.deep);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Dikim Rock Garden', titleX, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...GREEN.muted);
  doc.text('A Feel Of Nature  ·  Jos, Plateau State', titleX, 25);

  // Right-side report label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...GREEN.deep);
  doc.text('BOOKINGS REPORT', pageWidth - marginX, 16, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...GREEN.muted);
  doc.text(stamp, pageWidth - marginX, 22, { align: 'right' });
  doc.text('dikim-rock-garden.com.ng', pageWidth - marginX, 28, { align: 'right' });

  // Divider under header
  doc.setDrawColor(...GREEN.line);
  doc.setLineWidth(0.5);
  doc.line(marginX, 36, pageWidth - marginX, 36);

  // Summary cards
  const cardY = 41;
  const cardH = 16;
  const gap = 4;
  const cardW = (pageWidth - marginX * 2 - gap * 2) / 3;

  const cards = [
    { label: 'Total Bookings', value: String(bookings.length) },
    { label: 'Successful Payments', value: String(successCount) },
    { label: 'Total Revenue', value: formatMoney(totalRevenue) },
  ];

  cards.forEach((card, i) => {
    const x = marginX + i * (cardW + gap);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...GREEN.line);
    doc.setLineWidth(0.35);
    doc.roundedRect(x, cardY, cardW, cardH, 2.5, 2.5, 'FD');

    doc.setFillColor(...GREEN.mid);
    doc.roundedRect(x, cardY, 1.6, cardH, 0.8, 0.8, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...GREEN.muted);
    doc.text(card.label.toUpperCase(), x + 6, cardY + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...GREEN.ink);
    doc.text(card.value, x + 6, cardY + 12.5);
  });

  // Table
  const body = bookings.map((tx, index) => [
    String(index + 1),
    tx.name,
    tx.email,
    tx.room,
    formatArrival(tx.arrival_date),
    formatMoney(tx.amount),
    tx.reference,
    String(tx.status || '—').toUpperCase(),
    formatDateTime(tx.created_at),
  ]);

  autoTable(doc, {
    startY: cardY + cardH + 7,
    head: [['#', 'Guest', 'Email', 'Room', 'Arrival', 'Amount', 'Reference', 'Status', 'Booked']],
    body,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: { top: 2.6, right: 2.2, bottom: 2.6, left: 2.2 },
      overflow: 'linebreak',
      valign: 'middle',
      textColor: GREEN.ink,
      lineColor: GREEN.line,
      lineWidth: 0.2,
      minCellHeight: 8,
    },
    headStyles: {
      fillColor: GREEN.deep,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
      cellPadding: { top: 3.2, right: 2.2, bottom: 3.2, left: 2.2 },
    },
    alternateRowStyles: {
      fillColor: GREEN.soft,
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 28, fontStyle: 'bold' },
      2: { cellWidth: 40 },
      3: { cellWidth: 28 },
      4: { cellWidth: 24 },
      5: { cellWidth: 26, fontStyle: 'bold', textColor: GREEN.deep },
      6: { cellWidth: 36, fontSize: 7 },
      7: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
      8: { cellWidth: 30 },
    },
    margin: { left: marginX, right: marginX, bottom: 18 },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 7) {
        const status = String(data.cell.raw || '').toLowerCase();
        if (status.includes('success')) {
          data.cell.styles.textColor = [27, 94, 32];
        } else if (status) {
          data.cell.styles.textColor = [183, 28, 28];
        }
      }
    },
  });

  // Footer on every page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const footerY = pageHeight - 10;

    doc.setDrawColor(...GREEN.line);
    doc.setLineWidth(0.4);
    doc.line(marginX, footerY - 4, pageWidth - marginX, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GREEN.muted);
    doc.text(
      'Dikim Rock Garden  ·  Mountain Green Street, Hwolshe, Jos  ·  Confidential staff document',
      marginX,
      footerY
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - marginX, footerY, { align: 'right' });
  }

  const dataUri = doc.output('datauristring') as string;
  const base64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;

  return { doc, filename, base64 };
}

export async function downloadBookingsPdf(bookings: BookingPdfRow[]) {
  const { doc, filename } = await buildBookingsPdf(bookings);
  doc.save(filename);
}
