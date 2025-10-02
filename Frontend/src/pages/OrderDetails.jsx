import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ordersAPI } from '../services/apiService';
import { 
  ArrowLeftIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  PrinterIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getOrder(orderId);
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        setError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      const response = await ordersAPI.cancelOrder(orderId);
      if (response.data.success) {
        setOrder({ ...order, status: 'cancelled' });
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      setError('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-5 w-5" />;
      case 'processing': return <ClockIcon className="h-5 w-5" />;
      case 'shipped': return <TruckIcon className="h-5 w-5" />;
      case 'delivered': return <CheckCircleIcon className="h-5 w-5" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5" />;
      default: return <ClockIcon className="h-5 w-5" />;
    }
  };

  const getOrderProgress = (status) => {
    const statuses = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statuses.indexOf(status);
    return currentIndex >= 0 ? currentIndex + 1 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4 text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/profile"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderProgress = getOrderProgress(order.status);
  const progressSteps = [
    { name: 'Order Placed', status: 'pending' },
    { name: 'Processing', status: 'processing' },
    { name: 'Shipped', status: 'shipped' },
    { name: 'Delivered', status: 'delivered' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Orders
            </button>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print Order
          </button>
        </div>

        {/* Order Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order #{order.orderNumber}</h1>
              <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-2 capitalize">{order.status}</span>
              </span>
              <span className="text-2xl font-bold text-emerald-600">₹{order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Order Progress */}
          {order.status !== 'cancelled' && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Progress</h3>
              <div className="flex items-center justify-between">
                {progressSteps.map((step, index) => (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      index < orderProgress 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : index === orderProgress
                        ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {index < orderProgress ? (
                        <CheckCircleIcon className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-semibold">{index + 1}</span>
                      )}
                    </div>
                    <span className="text-xs mt-2 text-center font-medium">{step.name}</span>
                    {index < progressSteps.length - 1 && (
                      <div className={`absolute h-0.5 w-full mt-4 ${
                        index < orderProgress - 1 ? 'bg-emerald-600' : 'bg-gray-300'
                      }`} style={{ top: '16px', left: '50%', right: '-50%', zIndex: -1 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {(order.status === 'pending' || order.status === 'processing') && (
              <button
                onClick={handleCancelOrder}
                className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <XCircleIcon className="h-4 w-4 mr-2" />
                Cancel Order
              </button>
            )}
            {order.status === 'delivered' && (
              <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                <ShoppingBagIcon className="h-4 w-4 mr-2" />
                Reorder Items
              </button>
            )}
            <a
              href={`tel:+919876543210`}
              className="flex items-center px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              <PhoneIcon className="h-4 w-4 mr-2" />
              Contact Support
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Items List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items ({order.items.length})</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={`https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=80&q=80`}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-600">Price: ₹{item.price} each</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            {order.orderNotes && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Notes</h2>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{order.orderNotes}</p>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Delivery Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="h-5 w-5 text-emerald-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900">Delivery Address</h2>
              </div>
              <div className="text-gray-700">
                <p className="font-semibold">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                <p>{order.shippingAddress.pincode}</p>
                <p className="mt-2">📞 {order.shippingAddress.phone}</p>
                <p>📧 {order.shippingAddress.email}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="h-5 w-5 text-emerald-600 mr-2" />
                <h2 className="text-lg font-bold text-gray-900">Payment Details</h2>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-semibold capitalize">{order.paymentMethod}</span>
                </div>
                {order.paymentMethod === 'cod' && (
                  <p className="text-sm text-gray-500">💰 Pay ₹{order.total.toFixed(2)} when your order arrives</p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{(order.total / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">₹{(order.total - (order.total / 1.18)).toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-emerald-600">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <TruckIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">Tracking Info</h2>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Tracking Number</p>
                  <p className="font-mono text-lg font-bold text-emerald-600">{order.trackingNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
