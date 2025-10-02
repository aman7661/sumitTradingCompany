import React from 'react';
import { COMPANY_INFO } from '../utils/constants';

const Contact = () => (
  <div className="min-h-screen py-16 bg-white">
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-emerald-700 mb-6">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-4">We'd love to hear from you! Reach out for support, feedback, or partnership opportunities.</p>
      <div className="bg-emerald-50 rounded-xl p-6 mb-6">
        <p className="mb-2"><span className="font-semibold">Phone:</span> {COMPANY_INFO.phone}</p>
        <p><span className="font-semibold">Email:</span> {COMPANY_INFO.email}</p>
      </div>
      <form className="space-y-4">
        <input type="text" placeholder="Your Name" className="input-field" />
        <input type="email" placeholder="Your Email" className="input-field" />
        <textarea placeholder="Your Message" rows={4} className="input-field" />
        <button type="submit" className="btn-primary w-full">Send Message</button>
      </form>
    </div>
  </div>
);
export default Contact;
