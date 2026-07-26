import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getServerSupabase, sendBookingNotification, sendContactNotification, sendBookingsListEmail } from './mail.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

dotenv.config({ path: path.join(root, '.env.local') });
dotenv.config({ path: path.join(root, '.env') });

const app = express();
const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || (isProd ? 3000 : process.env.API_PORT || 3001));

app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { reference, name, email, room, amount, arrival_date } = req.body || {};

    if (!reference) {
      return res.status(400).json({ success: false, message: 'No reference provided' });
    }

    const secretKey =
      process.env.PAYSTACK_SECRET_KEY || 'sk_test_0eb77c7952b9c4b4c6fe9090a5eac72d4675c16c';

    const verifyUrl = `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`;
    const paystackRes = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!paystackRes.ok) {
      return res.status(400).json({
        success: false,
        message: 'Failed to verify transaction with Paystack',
      });
    }

    const paystackData = await paystackRes.json();

    if (!paystackData?.data || paystackData.data.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed with Paystack!',
        error: paystackData,
      });
    }

    const status = paystackData.data.status;
    const supabase = getServerSupabase();

    const { error: dbError } = await supabase.from('transactions').insert([
      {
        name: name || '',
        email: email || '',
        room: room || '',
        amount: parseFloat(amount) || 0,
        reference,
        status,
        arrival_date: arrival_date || null,
      },
    ]);

    if (dbError) {
      console.error('Supabase transaction insert error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Database insert failed: ' + dbError.message,
      });
    }

    let emailSent = false;
    try {
      const mailResult = await sendBookingNotification({
        name: name || '',
        email: email || '',
        room: room || '',
        amount: parseFloat(amount) || 0,
        reference,
        arrival_date: arrival_date || null,
        status,
      });
      emailSent = Boolean(mailResult.sent);
      if (!mailResult.sent) {
        console.warn('Booking saved, but notification email was not sent:', mailResult.reason);
      }
    } catch (mailErr) {
      console.error('Booking notification email failed:', mailErr);
    }

    return res.json({
      success: true,
      message: 'Payment verified and stored successfully!',
      emailSent,
    });
  } catch (error) {
    console.error('API Verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error: ' + (error?.message || 'unknown'),
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const payload = {
      name: String(name).trim(),
      email: String(email).trim(),
      subject: subject ? String(subject).trim() : '',
      message: String(message).trim(),
    };

    const supabase = getServerSupabase();
    const { error: dbError } = await supabase.from('contact_messages').insert([payload]);

    if (dbError) {
      console.error('Contact message insert error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Could not save message: ' + dbError.message,
      });
    }

    let emailSent = false;
    try {
      const mailResult = await sendContactNotification(payload);
      emailSent = Boolean(mailResult.sent);
      if (!mailResult.sent) {
        console.warn('Contact saved, but email was not sent:', mailResult.reason);
      }
    } catch (mailErr) {
      console.error('Contact notification email failed:', mailErr);
    }

    return res.json({
      success: true,
      message: 'Message sent successfully!',
      emailSent,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error: ' + (error?.message || 'unknown'),
    });
  }
});

app.post('/api/share-bookings', async (req, res) => {
  try {
    const { bookings, pdfBase64, filename, sharedBy } = req.body || {};

    if (!Array.isArray(bookings) || bookings.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No bookings provided to share',
      });
    }

    if (bookings.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Too many bookings in one share (max 500). Narrow your search and try again.',
      });
    }

    const mailResult = await sendBookingsListEmail({
      bookings,
      pdfBase64: pdfBase64 || null,
      filename: filename || 'dikim-bookings.pdf',
      sharedBy: sharedBy || '',
    });

    if (!mailResult.sent) {
      return res.status(500).json({
        success: false,
        message: mailResult.reason || 'Failed to email bookings list',
      });
    }

    return res.json({
      success: true,
      message: `Bookings list emailed to ${mailResult.to || 'dikimrockgarden@gmail.com'}`,
      emailId: mailResult.id,
    });
  } catch (error) {
    console.error('Share bookings API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error: ' + (error?.message || 'unknown'),
    });
  }
});

if (isProd) {
  const dist = path.join(root, 'dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
} else {
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, mode: 'api-only' });
  });
}

app.listen(port, () => {
  console.log(`> API${isProd ? ' + static' : ''} ready on http://localhost:${port}`);
});
