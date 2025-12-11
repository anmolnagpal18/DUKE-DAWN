import React, { useState } from 'react';
import { contactService } from '../services/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactService.sendContact(form);
      setStatus({ type: 'success', message: 'Message sent — we will get back to you shortly.' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send message. Try again later.' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-gold-400 mb-4">Contact Us</h2>
      <p className="text-gray-400 mb-6">Have a question or feedback? Send us a message.</p>

      {status && (
        <div className={`p-3 rounded mb-4 ${status.type === 'success' ? 'bg-green-700 text-white' : 'bg-red-700 text-white'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-dark-800 p-6 rounded">
        <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="w-full p-3 rounded bg-dark-900 text-white border border-gray-700" />
        <input name="email" value={form.email} onChange={handleChange} required type="email" placeholder="Email" className="w-full p-3 rounded bg-dark-900 text-white border border-gray-700" />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject (optional)" className="w-full p-3 rounded bg-dark-900 text-white border border-gray-700" />
        <textarea name="message" value={form.message} onChange={handleChange} required rows={6} placeholder="Write your message" className="w-full p-3 rounded bg-dark-900 text-white border border-gray-700" />

        <div className="flex justify-end">
          <button type="submit" className="bg-gold-500 text-dark-900 px-6 py-2 rounded font-bold">Send Message</button>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
