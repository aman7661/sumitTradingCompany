import api from './api';

// Products API calls
export const productsAPI = {
  // Get products for customers (only active products)
  getProducts: (params = {}) => {
    return api.get('/products', { params });
  },
  
  // Get all products for admin (including hidden)
  getAllProductsForAdmin: () => {
    return api.get('/products/admin/all');
  },
  
  // Get featured products
  getFeaturedProducts: () => api.get('/products/featured'),
  
  // Get single product
  getProduct: (productId) => api.get(`/products/${productId}`),
  
  // Admin only operations
  createProduct: (data) => api.post('/products', data),
  updateProduct: (productId, data) => api.put(`/products/${productId}`, data),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  toggleProductVisibility: (productId) => api.put(`/products/${productId}/toggle`),
};

// Orders API calls
export const ordersAPI = {
  // Customer order functions
  getUserOrders: () => api.get('/orders'),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  createOrder: (orderData) => api.post('/orders', orderData),
  cancelOrder: (orderId) => api.put(`/orders/${orderId}/cancel`),

  
  // Admin order functions
  getAllOrdersForAdmin: (params = {}) => api.get('/orders/admin/all', { params }),
  getOrderForAdmin: (orderId) => api.get(`/orders/admin/${orderId}`),
  updateOrderStatus: (orderId, data) => api.put(`/orders/admin/${orderId}/status`, data),
  bulkUpdateOrderStatus: (data) => api.put('/orders/admin/bulk-update', data),
  getOrderStats: () => api.get('/orders/admin/stats'),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),

};

// Profile API calls  
export const profileAPI = {
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Payment API calls - Updated for both test and real Stripe
export const paymentsAPI = {
  // For demo/test purposes (creates order without real payment)
  createTestStripeOrder: (orderData) => api.post('/payments/create-test-stripe-order', { orderData }),
  
  // For real Stripe integration (future use)
  createStripeIntent: (amount) => api.post('/payments/create-stripe-intent', { amount }),
  verifyStripePayment: (paymentData) => api.post('/payments/verify-stripe', paymentData),
};
