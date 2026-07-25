import { Resend } from 'resend';

export type BookingEmailPayload = {
  name: string;
  email: string;
  room: string;
  amount: number;
  reference: string;
  arrival_date?: string | null;
  status: string;
};

function formatArrival(date?: string | null) {
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

export async function sendBookingNotification(booking: BookingEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyTo = process.env.BOOKING_NOTIFY_EMAIL || 'dikimrockgarden@gmail.com';
  // Resend test sender works immediately; replace with your verified domain later
  const from =
    process.env.RESEND_FROM_EMAIL || 'Dikim Rock Garden <onboarding@resend.dev>';

  if (!apiKey || apiKey === 'your-resend-api-key') {
    console.warn('Booking email skipped: set RESEND_API_KEY in .env.local');
    return { sent: false, reason: 'RESEND_API_KEY not configured' as const };
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

  return { sent: true as const, id: data?.id };
}
