import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { useCart } from './context/CartContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import CartSidebar from './components/cart/CartSidebar';

// Pages
import Home from './pages/Home';
import AdminOrders from './pages/AdminOrders';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import BestSellers from './pages/BestSellers';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import OrderSuccess from './pages/OrderSuccess';

// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

// AppContent component to access cart context
const AppContent = () => {
  const { showToast, toastMessage, setShowToast } = useCart();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/bestsellers" element={<BestSellers />} />

          {/* Customer-Only Routes (Admin blocked from these) */}
          <Route path="/cart" element={
            <ProtectedRoute customerOnly>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute customerOnly>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute customerOnly>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute customerOnly>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/order/:orderId" element={
            <ProtectedRoute customerOnly>
              <OrderDetails />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute customerOnly>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          
          {/* Admin-Only Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
                    
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly>
              <AdminOrders />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <Footer />
      
      {/* Only show CartSidebar for customers */}
      <CartSidebar />
      
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
