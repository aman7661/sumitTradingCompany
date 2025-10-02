import React from 'react';
import { useCart } from '../../context/CartContext';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CartSidebar = () => {
  const { user } = useAuth();
  const { 
    cartItems, 
    cartTotal, 
    cartItemsCount, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  // Don't show cart sidebar for admin users
  if (!isOpen || user?.role === 'admin') return null;

  return (
    <>
      {/* Sidebar - Remove backdrop, make it non-blocking */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-emerald-50 to-teal-50">
          <h2 className="text-xl font-bold text-gray-900">
            🛒 Cart ({cartItemsCount})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 h-[calc(100vh-180px)]">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <button
                onClick={closeCart}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                  {/* Product Image */}
                  <img
                    src={item.product.images?.[0]?.url || '/api/placeholder/60/60'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-gray-600">
                      ₹{item.product.discountPrice || item.product.price} each
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-1 mt-1">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="px-2 py-1 bg-white rounded border text-xs min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product._id)}
                        className="p-1 hover:bg-red-100 rounded text-red-600 ml-2"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-right">
                    <p className="font-semibold text-emerald-600 text-sm">
                      ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold mb-3">
              <span>Total:</span>
              <span className="text-emerald-600">₹{cartTotal.toFixed(2)}</span>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-2">
              <Link
                to="/cart"
                onClick={closeCart}
                className="block w-full bg-gray-100 text-gray-900 text-center py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
              >
                View Full Cart
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block w-full bg-emerald-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors text-sm"
              >
                Checkout Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
