import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.success) {
      navigate(result.user.role === 'admin' ? '/admin' : '/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-emerald-700 mb-6 text-center">Login</h2>
        {error && <div className="text-red-600 bg-red-50 rounded px-3 py-2 mb-4 text-center">{error}</div>}
        <div className="space-y-4">
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
        </div>
        <button type="submit" disabled={loading}
          className="w-full mt-6 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded transition cursor-pointer shadow">
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center text-sm">
          Don't have an account? <a href="/register" className="text-emerald-600 font-medium hover:underline cursor-pointer">Register</a>
        </div>
      </form>
    </div>
  );
};
export default Login;
