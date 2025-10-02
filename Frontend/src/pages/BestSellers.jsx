import React from 'react';
import { Link } from 'react-router-dom';

const BestSellers = () => (
  <div className="min-h-screen py-16 bg-gradient-to-br from-yellow-50 to-emerald-50">
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-yellow-700 mb-6">Our Best Sellers</h1>
      <p className="text-lg text-gray-700 mb-8">Discover the most popular products loved by our customers!</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Replace with dynamic product cards later */}
        {[1,2,3,4,5,6].map((id) => (
          <div key={id} className="card p-6 flex flex-col items-center">
            <div className="bg-yellow-100 rounded-full w-24 h-24 flex items-center justify-center mb-4">
              <span className="text-4xl">🌟</span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Product {id}</h3>
            <p className="text-gray-600 mb-4">Bestselling grocery item description.</p>
            <Link to="/products/1" className="btn-primary">View Product</Link>
          </div>
        ))}
      </div>
    </div>
  </div>
);
export default BestSellers;
