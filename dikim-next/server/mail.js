import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export function getServerSupabase() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    '';

  const rawKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  const key =
    !rawKey ||
    rawKey.includes('your-service-role') ||
    rawKey.includes('your-') ||
    rawKey.includes('placeholder')
      ? process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        ''
      : rawKey;

  if (!url || !key) {
    throw new Error('Supabase server credentials are missing');
  }

  return createClient(url, key);
}

function formatArrival(date) {
  if (!date) return 'Not provided';
  try {
    return new Date(date).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return date;
  }
}

export async function sendBookingNotification(booking) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.BOOKING_NOTIFY_EMAIL || 'dikimrockgarden@gmail.com';
  const from =
    process.env.RESEND_FROM_EMAIL || 'Dikim Rock Garden <onboarding@resend.dev>';

  if (!apiKey || apiKey === 'your-resend-api-key') {
    console.warn('Booking email skipped: set RESEND_API_KEY in .env.local');
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);
  const amountText = `₦${Number(booking.amount || 0).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
  })}`;
  const arrivalText = formatArrival(booking.arrival_date);
  const subject = `New Room Booking — ${booking.room} (${booking.reference})`;

  const text = [
    'A new room booking was completed successfully on Dikim Rock Garden.',
    '',
    `Guest Name: ${booking.name}`,
    `Guest Email: ${booking.email}`,
    `Room: ${booking.room}`,
    `Arrival Date: ${arrivalText}`,
    `Amount Paid: ${amountText}`,
    `Payment Reference: ${booking.reference}`,
    `Status: ${booking.status}`,
    '',
    'Please confirm the reservation and prepare the room.',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0a150a;">
      <div style="background: #0d5c0d; color: #fff; padding: 20px 24px;">
        <h1 style="margin: 0; font-size: 22px;">Dikim Rock Garden</h1>
        <p style="margin: 8px 0 0; opacity: .9;">New successful room booking</p>
      </div>
      <div style="border: 1px solid #c8e6c9; border-top: none; padding: 24px; background: #f8fffa;">
        <p style="margin-top: 0;">A guest has booked a room and payment was verified.</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 8px 0; color: #555;">Guest Name</td><td style="padding: 8px 0; font-weight: 700;">${booking.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Guest Email</td><td style="padding: 8px 0;"><a href="mailto:${booking.email}">${booking.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Room</td><td style="padding: 8px 0; font-weight: 700;">${booking.room}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Arrival Date</td><td style="padding: 8px 0; font-weight: 700;">${arrivalText}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Amount Paid</td><td style="padding: 8px 0; font-weight: 700;">${amountText}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Paystack Ref</td><td style="padding: 8px 0; font-family: monospace;">${booking.reference}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Status</td><td style="padding: 8px 0;">${booking.status}</td></tr>
        </table>
        <p style="margin-bottom: 0; color: #555; font-size: 13px;">Please confirm the reservation and prepare the room.</p>
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to: [notifyTo],
    replyTo: booking.email || undefined,
    subject,
    text,
    html,
  });

  if (error) {
    console.error('Resend email error:', error);
    return { sent: false, reason: error.message || 'Resend send failed' };
  }

  return { sent: true, id: data?.id };
}

export async function sendContactNotification(contact) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.BOOKING_NOTIFY_EMAIL || 'dikimrockgarden@gmail.com';
  const from =
    process.env.RESEND_FROM_EMAIL || 'Dikim Rock Garden <onboarding@resend.dev>';

  if (!apiKey || apiKey === 'your-resend-api-key') {
    console.warn('Contact email skipped: set RESEND_API_KEY in .env.local');
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  const resend = new Resend(apiKey);
  const subjectLine = contact.subject?.trim()
    ? contact.subject.trim()
    : 'Website contact message';
  const subject = `Contact form — ${subjectLine}`;

  const text = [
    'A new message was submitted on the Dikim Rock Garden contact form.',
    '',
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Subject: ${subjectLine}`,
    '',
    'Message:',
    contact.message || '',
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #0a150a;">
      <div style="background: #0d5c0d; color: #fff; padding: 20px 24px;">
        <h1 style="margin: 0; font-size: 22px;">Dikim Rock Garden</h1>
        <p style="margin: 8px 0 0; opacity: .9;">New contact form message</p>
      </div>
      <div style="border: 1px solid #c8e6c9; border-top: none; padding: 24px; background: #f8fffa;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr><td style="padding: 8px 0; color: #555;">Name</td><td style="padding: 8px 0; font-weight: 700;">${contact.name}</td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Email</td><td style="padding: 8px 0;"><a href="mailto:${contact.email}">${contact.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #555;">Subject</td><td style="padding: 8px 0; font-weight: 700;">${subjectLine}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; white-space: pre-wrap;">${(contact.message || '').replace(/</g, '&lt;')}</div>
        <p style="margin-bottom: 0; color: #555; font-size: 13px;">Reply directly to this email to respond to the guest.</p>
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from,
    to: [notifyTo],
    replyTo: contact.email || undefined,
    subject,
    text,
    html,
  });

  if (error) {
    console.error('Resend contact email error:', error);
    return { sent: false, reason: error.message || 'Resend send failed' };
  }

  return { sent: true, id: data?.id };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendBookingsListEmail({ bookings, pdfBase64, filename, sharedBy }) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.BOOKING_NOTIFY_EMAIL || 'dikimrockgarden@gmail.com';
  const from =
    process.env.RESEND_FROM_EMAIL || 'Dikim Rock Garden <onboarding@resend.dev>';

  if (!apiKey || apiKey === 'your-resend-api-key') {
    console.warn('Bookings share email skipped: set RESEND_API_KEY in .env.local');
    return { sent: false, reason: 'RESEND_API_KEY not configured' };
  }

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return { sent: false, reason: 'No bookings to share' };
  }

  const resend = new Resend(apiKey);
  const stamp = new Date().toLocaleString('en-NG');
  const subject = `Bookings list shared — ${bookings.length} booking(s)`;

  const rowsHtml = bookings
    .map((tx) => {
      const arrival = tx.arrival_date
        ? new Date(tx.arrival_date).toLocaleDateString('en-NG')
        : '—';
      const amount = `₦${Number(tx.amount || 0).toLocaleString('en-NG', {
        minimumFractionDigits: 2,
      })}`;
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #e8f5e9;">${escapeHtml(tx.id)}</td>
        <td style="padding:8px;border-bottom:1px solid #e8f5e9;"><strong>${escapeHtml(tx.name)}</strong><br/><a href="mailto:${escapeHtml(tx.email)}">${escapeHtml(tx.email)}</a></td>
        <td style="padding:8px;border-bottom:1px solid #e8f5e9;">${escapeHtml(tx.room)}</td>
        <td style="padding:8px;border-bottom:1px solid #e8f5e9;">${escapeHtml(arrival)}</td>
        <td style="padding:8px;border-bottom:1px solid #e8f5e9;">${escapeHtml(amount)}</td>
        <td style="padding:8px;border-bottom:1px solid #e8f5e9;font-family:monospace;font-size:12px;">${escapeHtml(tx.reference)}</td>
        <td style="padding:8px;border-bottom:1px solid #e8f5e9;">${escapeHtml(tx.status)}</td>
      </tr>`;
    })
    .join('');

  const text = [
    'Dikim Rock Garden — Bookings list shared from Admin Portal',
    sharedBy ? `Shared by: ${sharedBy}` : '',
    `Generated: ${stamp}`,
    `Total bookings: ${bookings.length}`,
    '',
    ...bookings.map(
      (tx) =>
        `#${tx.id} | ${tx.name} <${tx.email}> | ${tx.room} | Arrival: ${tx.arrival_date || '—'} | ₦${tx.amount} | ${tx.reference} | ${tx.status}`
    ),
  ]
    .filter(Boolean)
    .join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; color: #0a150a;">
      <div style="background: #0d5c0d; color: #fff; padding: 20px 24px;">
        <h1 style="margin: 0; font-size: 22px;">Dikim Rock Garden</h1>
        <p style="margin: 8px 0 0; opacity: .9;">Bookings list shared from Admin Portal</p>
      </div>
      <div style="border: 1px solid #c8e6c9; border-top: none; padding: 24px; background: #f8fffa;">
        <p style="margin-top:0;">
          ${sharedBy ? `<strong>Shared by:</strong> ${escapeHtml(sharedBy)}<br/>` : ''}
          <strong>Generated:</strong> ${escapeHtml(stamp)}<br/>
          <strong>Total:</strong> ${bookings.length} booking(s)
        </p>
        <p style="color:#555;font-size:13px;">A branded PDF is attached to this email.</p>
        <table style="width:100%; border-collapse:collapse; font-size:13px; background:#fff;">
          <thead>
            <tr style="background:#2e7d32;color:#fff;text-align:left;">
              <th style="padding:8px;">ID</th>
              <th style="padding:8px;">Guest</th>
              <th style="padding:8px;">Room</th>
              <th style="padding:8px;">Arrival</th>
              <th style="padding:8px;">Amount</th>
              <th style="padding:8px;">Reference</th>
              <th style="padding:8px;">Status</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
    </div>
  `;

  const payload = {
    from,
    to: [notifyTo],
    subject,
    text,
    html,
  };

  if (pdfBase64 && filename) {
    payload.attachments = [
      {
        filename,
        content: pdfBase64,
      },
    ];
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    console.error('Resend bookings share email error:', error);
    return { sent: false, reason: error.message || 'Resend send failed' };
  }

  return { sent: true, id: data?.id, to: notifyTo };
}

