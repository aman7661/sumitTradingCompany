import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/apiService';
import { Link } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch products from backend using API service
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAllProductsForAdmin();
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Toggle product visibility - using API service
  const toggleVisibility = async (productId) => {
    try {
      const response = await productsAPI.toggleProductVisibility(productId);
      if (response.data.success) {
        fetchProducts(); // Refresh the list
        setMessage(response.data.message);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      setMessage('Failed to update product');
    }
  };

  // Delete product - using API service
  const deleteProduct = async (productId, productName) => {
    if (!window.confirm(`Delete "${productName}"?`)) return;
    
    try {
      const response = await productsAPI.deleteProduct(productId);
      if (response.data.success) {
        fetchProducts(); // Refresh the list
        setMessage(response.data.message);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setMessage('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <Link 
              to="/admin/orders"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              📦 Manage Orders
            </Link>
            <Link 
              to="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🏠 View Store
            </Link>
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button onClick={logout} className="text-red-600 hover:text-red-800 font-medium">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="p-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600 mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full text-left px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
              >
                ➕ Add Product
              </button>
              <Link
                to="/admin/orders"
                className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              >
                📦 View Orders
              </Link>
              <Link
                to="/"
                className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              >
                🛒 Customer View
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{products.length}</p>
            <p className="text-sm text-gray-500 mt-1">All products in system</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Visible Products</h3>
            <p className="text-3xl font-bold text-green-600">{products.filter(p => p.isActive !== false).length}</p>
            <p className="text-sm text-gray-500 mt-1">Available to customers</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-600">Hidden Products</h3>
            <p className="text-3xl font-bold text-red-600">{products.filter(p => p.isActive === false).length}</p>
            <p className="text-sm text-gray-500 mt-1">Not visible to customers</p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            + Add New Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Products Management</h2>
              <div className="text-sm text-gray-500">
                Total: {products.length} | Visible: {products.filter(p => p.isActive !== false).length} | Hidden: {products.filter(p => p.isActive === false).length}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className={`hover:bg-gray-50 ${product.isActive === false ? 'bg-red-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={product.images?.[0]?.url || 'https://placehold.co/50x50/e5e7eb/6b7280?text=No+Image'} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                        />
                        <div>
                          <div className={`text-sm font-medium ${product.isActive === false ? 'text-gray-500' : 'text-gray-900'}`}>
                            {product.name}
                            {product.isActive === false && (
                              <span className="ml-2 text-xs text-red-500 font-normal">(Hidden from customers)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        ₹{product.discountPrice || product.price}
                        {product.discountPrice && (
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 10 
                          ? 'bg-green-100 text-green-800'
                          : product.stock > 0 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive !== false
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive !== false ? '👁️ Visible' : '🙈 Hidden'}
                      </span>
                      {product.featured && (
                        <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          ⭐ Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleVisibility(product._id)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            product.isActive !== false
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {product.isActive !== false ? 'Hide' : 'Show'}
                        </button>
                        <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Product"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                        <button
                          onClick={() => deleteProduct(product._id, product.name)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition-colors"
                          title="Permanently delete product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {products.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first product.</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                + Add Your First Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <AddProductModal 
          onClose={() => setShowAddForm(false)}
          onProductAdded={() => {
            fetchProducts();
            setShowAddForm(false);
          }}
        />
      )}
    </div>
  );
};

// Add Product Modal Component
const AddProductModal = ({ onClose, onProductAdded }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'Cooking Essentials',
    subcategory: '',
    brand: '',
    unit: 'kg',
    stock: '',
    images: [{ url: '' }],
    isActive: true,
    featured: false
  });

  const categories = [
    'Pooja Needs',
    'Cooking Essentials', 
    'Snacks & Namkeens',
    'Home Cleaning',
    'Disposables',
    'Dairy & Beverages',
    'Grains & Pulses',
    'Spices & Seasonings',
    'Oil & Ghee',
    'Baking Essentials',
    'Health & Wellness',
    'Baby Care',
    'Personal Care',
    'Kitchen Utensils'
  ];

  const units = ['kg', 'g', 'l', 'ml', 'piece', 'pack', 'dozen'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.url.trim() !== '')
      };

      const response = await productsAPI.createProduct(productData);
      
      if (response.data.success) {
        onProductAdded();
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Add New Product</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name *"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="text"
              name="brand"
              placeholder="Brand *"
              value={formData.brand}
              onChange={handleInputChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
            <textarea
              name="description"
              placeholder="Description *"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              name="subcategory"
              placeholder="Subcategory *"
              value={formData.subcategory}
              onChange={handleInputChange}
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
            <select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
            <input
              type="number"
              name="price"
              placeholder="Price *"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="number"
              name="discountPrice"
              placeholder="Discount Price (Optional)"
              value={formData.discountPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity *"
              value={formData.stock}
              onChange={handleInputChange}
              required
              min="0"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
            <input
              type="url"
              value={formData.images[0].url}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                images: [{ url: e.target.value }]
              }))}
              placeholder="Image URL"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Visible to customers</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured product</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;
