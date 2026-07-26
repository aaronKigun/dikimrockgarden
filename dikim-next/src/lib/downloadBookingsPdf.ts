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

async function loadImageDataUrl(url: string): Promise<{ dataUrl: string; format: 'JPEG' | 'PNG' }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load logo (${res.status})`);
  const blob = await res.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  const format = blob.type.includes('png') || url.toLowerCase().endsWith('.png') ? 'PNG' : 'JPEG';
  return { dataUrl, format };
}

async function loadBrandLogo() {
  const candidates = ['/images/dikimlogo2.png', '/images/Reallogo.jpg'];
  for (const url of candidates) {
    try {
      return await loadImageDataUrl(url);
    } catch {
      // try next
    }
  }
  return null;
}

function formatArrival(date?: string | null) {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('en-NG');
  } catch {
    return date;
  }
}

/** Build branded bookings PDF (with Dikim logo). */
export async function buildBookingsPdf(bookings: BookingPdfRow[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const stamp = new Date().toLocaleString('en-NG');
  const fileStamp = new Date().toISOString().slice(0, 10);
  const filename = `dikim-bookings-${fileStamp}.pdf`;

  // Green brand header
  doc.setFillColor(13, 92, 13);
  doc.rect(0, 0, pageWidth, 38, 'F');

  // Soft accent stripe
  doc.setFillColor(76, 175, 80);
  doc.rect(0, 38, pageWidth, 1.5, 'F');

  const logo = await loadBrandLogo();
  if (logo) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 6, 26, 26, 4, 4, 'F');
    doc.addImage(logo.dataUrl, logo.format, 12, 8, 22, 22);
  }

  const textLeft = logo ? 42 : 14;

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Dikim Rock Garden', textLeft, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('Room Bookings & Payments Report', textLeft, 24);

  doc.setFontSize(9);
  doc.text(`Generated: ${stamp}`, pageWidth - 14, 16, { align: 'right' });
  doc.text(`${bookings.length} booking(s)`, pageWidth - 14, 24, { align: 'right' });
  doc.text('dikim-rock-garden.com.ng', pageWidth - 14, 31, { align: 'right' });

  const body = bookings.map((tx) => [
    String(tx.id),
    tx.name,
    tx.email,
    tx.room,
    formatArrival(tx.arrival_date),
    `NGN ${Number(tx.amount || 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
    tx.reference,
    tx.status,
    new Date(tx.created_at).toLocaleString('en-NG'),
  ]);

  autoTable(doc, {
    startY: 46,
    head: [
      ['ID', 'Guest', 'Email', 'Room', 'Arrival', 'Amount', 'Reference', 'Status', 'Booked At'],
    ],
    body,
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      overflow: 'linebreak',
      valign: 'middle',
      textColor: [20, 40, 20],
    },
    headStyles: {
      fillColor: [46, 125, 50],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [241, 248, 233],
    },
    columnStyles: {
      0: { cellWidth: 12 },
      4: { cellWidth: 22 },
      5: { cellWidth: 28 },
      6: { cellWidth: 38 },
      7: { cellWidth: 18 },
    },
    margin: { left: 12, right: 12 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const y = doc.internal.pageSize.getHeight() - 8;
    doc.setDrawColor(200, 230, 201);
    doc.line(12, y - 4, pageWidth - 12, y - 4);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      'Dikim Rock Garden · Mountain Green Street, Hwolshe, Jos · Confidential',
      12,
      y
    );
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 12, y, { align: 'right' });
  }

  const dataUri = doc.output('datauristring') as string;
  const base64 = dataUri.includes(',') ? dataUri.split(',')[1] : dataUri;

  return { doc, filename, base64 };
}

export async function downloadBookingsPdf(bookings: BookingPdfRow[]) {
  const { doc, filename } = await buildBookingsPdf(bookings);
  doc.save(filename);
}
