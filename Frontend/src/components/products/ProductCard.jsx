import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, CheckIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart, updateQuantity, removeFromCart, openCart, cartItems } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Find quantity of this specific product in cart
  const cartItem = cartItems.find(item => item.product._id === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart(product, 1);
    
    // Small delay to show the adding state, then open cart
    setTimeout(() => {
      setIsAdding(false);
      openCart(); // This will show the cart sidebar
    }, 500);
  };

  const handleQuantityDecrease = () => {
    if (quantityInCart <= 1) {
      removeFromCart(product._id);
    } else {
      updateQuantity(product._id, quantityInCart - 1);
    }
  };

  const handleQuantityIncrease = () => {
    if (quantityInCart < product.stock) {
      updateQuantity(product._id, quantityInCart + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 group">
      <div className="block aspect-square overflow-hidden">
        <img
          src={product.images?.[0]?.url || 'https://placehold.co/300x300/e5e7eb/6b7280?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-emerald-600 mb-2 font-medium">{product.category}</p>
        
        <div className="flex items-center mb-2">
          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="text-sm text-gray-600">{product.ratings?.average || 4.5}</span>
          <span className="text-xs text-gray-400 ml-1">({product.ratings?.count || 25})</span>
        </div>
        
        <div className="flex items-baseline space-x-2 mb-3">
          <span className="text-lg font-bold text-emerald-600">
            ₹{product.discountPrice || product.price}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">
                SAVE ₹{product.price - product.discountPrice}
              </span>
            </>
          )}
        </div>
        
        <div className="flex space-x-2">
          {/* Conditional Button Logic */}
          {quantityInCart === 0 ? (
            // Show Add to Cart button when not in cart
            <button
              onClick={handleAddToCart}
              disabled={isAdding || product.stock === 0}
              className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isAdding 
                  ? 'bg-green-600 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
              }`}
            >
              {product.stock === 0 ? (
                'Out of Stock'
              ) : isAdding ? (
                <span className="flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Added!
                </span>
              ) : (
                '+ Add to Cart'
              )}
            </button>
          ) : (
            // Show Quantity Selector when in cart
            <div className="flex-1 flex items-center bg-emerald-600 rounded-xl overflow-hidden">
              {/* Decrease Button */}
              <button
                onClick={handleQuantityDecrease}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              
              {/* Quantity Display */}
              <div className="flex-1 py-2 px-3 bg-emerald-50 text-emerald-700 font-bold text-center">
                {quantityInCart}
              </div>
              
              {/* Increase Button */}
              <button
                onClick={handleQuantityIncrease}
                disabled={quantityInCart >= product.stock}
                className={`flex-1 py-2 px-3 font-semibold transition-colors flex items-center justify-center ${
                  quantityInCart >= product.stock 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {/* View Button
          <Link
            to={`/products/${product._id}`}
            className="px-3 py-2 border-2 border-emerald-200 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors font-medium"
          >
            View
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
