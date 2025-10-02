import React from 'react';
import { COMPANY_INFO } from '../utils/constants';

const About = () => (
  <div className="min-h-screen py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-emerald-700 mb-6">About Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        <span className="font-semibold">{COMPANY_INFO.name}</span> is dedicated to bringing you the freshest groceries and daily essentials, delivered with care and speed. Our mission is to make healthy living easy and accessible for every family.
      </p>
      <ul className="list-disc pl-6 text-gray-600 space-y-2">
        <li>Locally sourced produce and premium brands</li>
        <li>Express delivery and easy returns</li>
        <li>Trusted by thousands of happy customers</li>
        <li>Secure payments and customer-first support</li>
      </ul>
    </div>
  </div>
);
export default About;
