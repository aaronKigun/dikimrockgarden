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
    } catch (err: any) {
      console.error('Contact submission error:', err);
      setFeedback({ 
        type: 'error', 
        text: 'Failed to send your message. Please try again or call us directly.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Strip */}
      <section className="about" id="about" style={{ marginTop: '8rem' }}>
        <div className="row" data-reveal="fade">
          <div className="image">
            <img src="/images/home.jpg" alt="Contact Dikim Rock Garden" />
          </div>
          <div className="content">
            <div className="section-eyebrow">Reach Out</div>
            <h3>CONTACT US</h3>
            <p>We&apos;d love to hear from you! Have questions or feedback? Interested in booking a room or placing a food order? Reach out to us anytime. We are here to assist you and make your experience exceptional.</p>
          </div>
        </div>
      </section>

      {/* Open Hours */}
      <section className="open-hours" data-reveal="fade">
        <h2>Open Hours</h2>
        <ul>
          <li><span>Monday:</span> 8:00 AM – 11:30 PM</li>
          <li><span>Tuesday:</span> 8:00 AM – 11:30 PM</li>
          <li><span>Wednesday:</span> 8:00 AM – 11:30 PM</li>
          <li><span>Thursday:</span> 8:00 AM – 11:30 PM</li>
          <li><span>Friday:</span> 8:00 AM – 11:30 PM</li>
          <li><span>Saturday:</span> 8:00 AM – 11:30 PM</li>
          <li><span>Sunday:</span> 8:00 AM – 11:30 PM</li>
        </ul>
      </section>

      {/* Contact Form & Details */}
      <div className="contact-wrap">
        <div className="contact-info-block" data-reveal="left">
          <h2>Get In Touch</h2>
          <p><strong>Visit Us:</strong> Mountain Green Street, Hwolshe, Jos, Plateau State, Nigeria</p>
          <p><strong>Call Us:</strong> +2349039284897</p>
          <p><strong>Email Us:</strong> dikimrockgarden@gmail.com</p>

          <div className="contact-social">
            <a href="#" className="fab fa-facebook-f" aria-label="Facebook"></a>
            <a href="#" className="fab fa-instagram" aria-label="Instagram"></a>
            <a href="#" className="fab fa-twitter" aria-label="Twitter"></a>
            <a href="#" className="fab fa-whatsapp" aria-label="WhatsApp"></a>
          </div>
        </div>

        <div className="contact-gif" data-reveal="fade">
          <img src="/images/contact_illustration.png" alt="Contact us illustration" />
        </div>

        <div className="contact-form-block" data-reveal="right">
          <h2>Send Us a Message</h2>
          <p>Have a specific inquiry? Fill out the form below, and we&apos;ll get back to you as soon as possible.</p>

          {feedback && (
            <div className={`badge ${feedback.type}`} style={{ display: 'block', width: '100%', padding: '1.2rem', fontSize: '1.4rem', margin: '0 0 2rem 0', borderRadius: 'var(--r-sm)' }}>
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <button type="submit" disabled={submitting}>
              {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
