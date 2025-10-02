import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load cart from localStorage on app start
  useEffect(() => {
    const savedCart = localStorage.getItem('sumit-trading-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('sumit-trading-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart with notification
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === product._id);
      
      if (existingItem) {
        // Update quantity if item already exists
        setToastMessage(`Updated ${product.name} in cart!`);
        return prevItems.map(item =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        setToastMessage(`${product.name} added to cart!`);
        return [...prevItems, { product, quantity }];
      }
    });
    
    // Show success notification
    setShowToast(true);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.product._id !== productId)
    );
    setToastMessage('Item removed from cart');
    setShowToast(true);
  };

  // Update item quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    setToastMessage('Cart cleared');
    setShowToast(true);
  };

  // Calculate totals
  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.product.discountPrice || item.product.price) * item.quantity,
    0
  );

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Toggle cart sidebar
  const toggleCart = () => setIsOpen(!isOpen);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const value = {
    cartItems,
    cartTotal,
    cartItemsCount,
    isOpen,
    showToast,
    toastMessage,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    setShowToast
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
