'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    if (!name || !email || !message) {
      setFeedback({ type: 'error', text: 'Please fill in all required fields.' });
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, subject, message }]);

      if (error) throw error;

      setFeedback({ type: 'success', text: 'Message sent successfully! We will get back to you soon.' });
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Contact submission error:', err);
      setFeedback({
        type: 'error',
        text: 'Failed to send your message. Please try again or call us directly.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const hours = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
  ];

  return (
    <>
      <section className="about" id="about">
        <div className="row" data-reveal="fade">
          <div className="image">
            <img src="/images/home.jpg" alt="Contact Dikim Rock Garden" />
          </div>
          <div className="content">
            <div className="section-eyebrow">Get In Touch</div>
            <h3>We&apos;d Love To Hear From You</h3>
            <p>
              Questions, bookings, or feedback — reach out anytime. Our team is here to make your Dikim Rock Garden experience exceptional.
            </p>
          </div>
        </div>
      </section>

      <section className="open-hours" data-reveal="fade">
        <div className="hours">
          <div className="section-eyebrow" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>Visit Us</div>
          <h2>Open Hours</h2>
          <ul>
            {hours.map((day) => (
              <li key={day}>
                <span>{day}</span>
                8:00 AM – 11:30 PM
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-grid">
          <div className="contact-details" data-reveal="left">
            <div className="section-eyebrow">Details</div>
            <h2>Visit, Call, or Write</h2>
            <p>Prefer a direct line? Use any of the contacts below — we respond promptly.</p>

            <div className="detail-list">
              <span>
                <i className="fa-solid fa-location-crosshairs" aria-hidden="true"></i>
                Mountain Green Street, Hwolshe, Jos, Plateau State, Nigeria
              </span>
              <a href="tel:+2349039284897">
                <i className="fa-solid fa-mobile" aria-hidden="true"></i>
                +234 903 928 4897
              </a>
              <a href="tel:+2347051555529">
                <i className="fa-solid fa-mobile" aria-hidden="true"></i>
                +234 705 155 5529
              </a>
              <a href="mailto:dikimrockgarden@gmail.com">
                <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
                dikimrockgarden@gmail.com
              </a>
            </div>

            <div className="contact-social">
              <a href="#" className="fab fa-facebook-f" aria-label="Facebook"></a>
              <a href="#" className="fab fa-instagram" aria-label="Instagram"></a>
              <a href="#" className="fab fa-twitter" aria-label="Twitter"></a>
              <a href="#" className="fab fa-whatsapp" aria-label="WhatsApp"></a>
            </div>

            <div className="contact-visual">
              <img
                src="/images/dikim-contact-us.gif"
                alt="Contact Dikim Rock Garden"
              />
            </div>
          </div>

          <div className="contact-form-wrap" data-reveal="right">
            <h2>Send A Message</h2>
            <p>Have a specific inquiry? Fill out the form and we&apos;ll get back to you soon.</p>

            {feedback && (
              <div className={`form-feedback ${feedback.type}`}>{feedback.text}</div>
            )}

            <form className="site-form" id="contactForm" onSubmit={handleSubmit}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />

              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
