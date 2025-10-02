import React from 'react';

const Orders = () => (
  <div className="min-h-screen py-16 bg-gradient-to-br from-gray-50 to-emerald-50">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-emerald-700 mb-6">My Orders</h1>
      <p className="text-lg text-gray-700 mb-8">Track your recent purchases and order status below.</p>
      <div className="bg-white rounded-xl shadow p-6">
        {/* Replace with dynamic order list later */}
        <p className="text-gray-600">No orders found. Start shopping to place your first order!</p>
      </div>
    </div>
  </div>
);
export default Orders;
