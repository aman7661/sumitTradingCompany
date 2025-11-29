import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { COMPANY_INFO, PRODUCT_CATEGORIES } from '../utils/constants';
import { 
  ShoppingBagIcon, 
  TruckIcon, 
  CreditCardIcon, 
  ShieldCheckIcon,
  StarIcon,
  SparklesIcon,
  HeartIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/products/featured');
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const features = [
    {
      icon: SparklesIcon,
      title: 'Premium Fresh',
      description: 'Hand-picked organic groceries delivered fresh daily',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: TruckIcon,
      title: 'Lightning Fast',
      description: 'Express delivery within 30 minutes to 2 hours',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: ShieldCheckIcon,
      title: '100% Secure',
      description: 'Safe payments with money-back guarantee',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: HeartIcon,
      title: 'Customer Love',
      description: '50k+ happy customers across the city',
      color: 'from-rose-400 to-rose-600'
    }
  ];

  const categoryIcons = ['🥬', '🥛', '🥩', '🌾', '🍿', '🧊', '🧴', '🧼'];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section - Beautiful Gradient */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.4'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium mb-8 shadow-lg">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Trusted by 50,000+ Families
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent">
              Fresh Groceries
              <span className="block text-4xl md:text-6xl mt-2">
                Delivered with 💚
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-6 text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Experience the <span className="font-semibold text-emerald-600">freshest groceries</span> delivered 
              to your doorstep in record time
            </p>
            
            <p className="text-lg mb-12 text-gray-600 max-w-2xl mx-auto">
              From farm-fresh vegetables to premium dairy products - everything you need for a healthy lifestyle
            </p>
            {/* Test Credentials */}
            <div className="mt-8 max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="mb-2 flex items-center text-sm font-semibold text-emerald-700">
                  <ShieldCheckIcon className="mr-2 h-4 w-4" />
                  Test Customer Login
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Use these credentials to explore the customer experience.
                </p>
                <div className="text-sm space-y-1 font-mono text-gray-800">
                  <div><span className="font-semibold">Email:</span> testuser@sumittrading.com</div>
                  <div><span className="font-semibold">Password:</span> Test@123</div>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-100 bg-white/80 p-4 shadow-sm backdrop-blur">
                <div className="mb-2 flex items-center text-sm font-semibold text-teal-700">
                  <StarIcon className="mr-2 h-4 w-4" />
                  Test Admin Login
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Use only for demo to manage products and orders.
                </p>
                <div className="text-sm space-y-1 font-mono text-gray-800">
                  <div><span className="font-semibold">Email:</span> admin@sumittrading.com</div>
                  <div><span className="font-semibold">Password:</span> Admin@123</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/products" 
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-2" />
                Start Shopping
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              {!isAuthenticated && (
                <Link 
                  to="/register" 
                  className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-2xl shadow-lg hover:shadow-xl border-2 border-emerald-100 hover:border-emerald-200 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Join Free Today
                </Link>
              )}
            </div>
            

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { number: '50k+', label: 'Happy Customers' },
                { number: '1000+', label: 'Products' },
                { number: '30min', label: 'Fast Delivery' },
                { number: '99.9%', label: 'Uptime' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{stat.number}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Card Design */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-emerald-600">Sumit Trading?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing grocery shopping with technology and care
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
                  <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories - Modern Card Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Shop by <span className="text-emerald-600">Category</span>
            </h2>
            <p className="text-xl text-gray-600">
              Explore our carefully curated product collections
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {PRODUCT_CATEGORIES.slice(0, 8).map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${encodeURIComponent(category)}`}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-center border border-gray-100">
                  <div className="text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {categoryIcons[index]}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-sm lg:text-base">
                    {category}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Enhanced Design */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ✨ <span className="text-emerald-600">Featured</span> Products
            </h2>
            <p className="text-xl text-gray-600">
              Handpicked favorites loved by our customers
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                  <div className="animate-pulse">
                    <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded-full w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product) => (
                <div key={product._id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden border border-gray-100">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
                    <img
                      src={product.images?.[0]?.url || '/api/placeholder/300/300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full mb-3">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-baseline space-x-2">
                        {product.discountPrice ? (
                          <>
                            <span className="text-xl font-bold text-emerald-600">
                              ₹{product.discountPrice}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.price}
                            </span>
                            <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                              SAVE ₹{product.price - product.discountPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-emerald-600">
                            ₹{product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {product.ratings?.average || 4.5}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">
                          ({product.ratings?.count || 25})
                        </span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">In Stock</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        Add to Cart
                      </button>
                      <Link
                        to={`/products/${product._id}`}
                        className="px-4 py-3 border-2 border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              View All Products
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action - Vibrant Design */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.1'%3E%3Cpath d='M20 20c0 0 10-10 10-20S20 0 20 0 0 0 0 20s10 20 10 20 10-10 10-20-10-20-10-20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your 
            <span className="block mt-2">Shopping Experience? 🛒</span>
          </h2>
          <p className="text-xl mb-10 text-emerald-100 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their daily groceries
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/products" 
              className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <ShoppingBagIcon className="h-5 w-5 mr-2" />
              Start Shopping Now
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-emerald-600 transform hover:-translate-y-1 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-emerald-100">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Free Delivery Above ₹500
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              30-Day Money Back Guarantee
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              24/7 Customer Support
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
