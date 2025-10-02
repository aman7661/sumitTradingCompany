import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'customer',
  address: {
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  }
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in form.address) {
      setForm({ ...form, address: { ...form.address, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      navigate(form.role === 'admin' ? '/admin' : '/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">Create Account</h2>
        {error && <div className="text-red-600 bg-red-50 rounded px-3 py-2 mb-4 text-center">{error}</div>}
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input id="name" name="name" type="text" value={form.name} onChange={handleChange} required
              className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required
              className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} required
              className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}
              className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer">
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <fieldset className="border-t pt-4">
            <legend className="block text-sm font-medium text-gray-700 mb-1">Address</legend>
            <div className="space-y-2">
              <input name="street" type="text" placeholder="Street" value={form.address.street} onChange={handleChange} required
                className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
              <input name="city" type="text" placeholder="City" value={form.address.city} onChange={handleChange} required
                className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
              <input name="state" type="text" placeholder="State" value={form.address.state} onChange={handleChange} required
                className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
              <input name="pincode" type="text" placeholder="Pincode" value={form.address.pincode} onChange={handleChange} required
                className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
              <input name="country" type="text" placeholder="Country" value={form.address.country} onChange={handleChange} required
                className="w-full px-4 py-2 border border-emerald-200 rounded focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition cursor-pointer" />
            </div>
          </fieldset>
        </div>
        <button type="submit" disabled={loading}
          className="w-full mt-6 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded transition cursor-pointer shadow">
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div className="mt-4 text-center text-sm">
          Already have an account? <a href="/login" className="text-emerald-600 font-medium hover:underline cursor-pointer">Login</a>
        </div>
      </form>
    </div>
  );
};
export default Register;
