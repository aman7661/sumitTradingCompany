import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI, paymentsAPI } from '../services/apiService';
import { 
  CheckIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  TruckIcon,
  CreditCardIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const [checkoutData, setCheckoutData] = useState({
    // Shipping Info
    shippingAddress: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
      country: user?.address?.country || 'India'
    },
    // Payment Info
    paymentMethod: 'cod',
    // Order Notes
    orderNotes: ''
  });
  
  const steps = [
    { 
      id: 1, 
      title: 'Shipping', 
      icon: TruckIcon,
      description: 'Contact & delivery info'
    },
    { 
      id: 2, 
      title: 'Payment', 
      icon: CreditCardIcon,
      description: 'Choose payment method'
    },
    { 
      id: 3, 
      title: 'Review', 
      icon: DocumentCheckIcon,
      description: 'Review & place order'
    }
  ];

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const updateCheckoutData = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCheckoutData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCheckoutData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        const { shippingAddress } = checkoutData;
        return shippingAddress.fullName && 
               shippingAddress.email && 
               shippingAddress.phone && 
               shippingAddress.street && 
               shippingAddress.city && 
               shippingAddress.state && 
               shippingAddress.pincode;
      case 2:
        return checkoutData.paymentMethod;
      default:
        return true;
    }
  };

  // Handle Stripe test payment (for demo purposes)
  const handleStripePayment = async (orderData) => {
    try {
      setPaymentLoading(true);
      setError('🔄 Processing Stripe test payment...');
      
      console.log('Creating Stripe test payment...');
      
      // Simulate payment processing delay
      setTimeout(() => {
        setError('💳 Stripe payment processing...');
      }, 1000);
      
      // Create test Stripe order (no real payment required)
      const response = await paymentsAPI.createTestStripeOrder(orderData);
      
      if (response.data.success) {
        setError('✅ Stripe test payment completed successfully!');
        console.log('Stripe test order created successfully');
        
        setTimeout(() => {
          clearCart();
          navigate('/order-success');
        }, 1500);
      }
    } catch (error) {
      console.error('Stripe payment error:', error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(`❌ Stripe payment failed: ${errorMessage}`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare order data for API
      const orderData = {
        items: cartItems,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod,
        orderNotes: checkoutData.orderNotes
      };
      
      if (checkoutData.paymentMethod === 'cod') {
        // Handle COD order directly
        console.log('Placing COD order...');
        const response = await ordersAPI.createOrder(orderData);
        
        if (response.data && response.data.success) {
          clearCart();
          navigate('/order-success');
        } else {
          throw new Error('Order creation failed');
        }
      } else if (checkoutData.paymentMethod === 'stripe') {
        // Handle Stripe test payment
        console.log('Processing Stripe test payment...');
        await handleStripePayment(orderData);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to continue with checkout.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Error Message */}
        {error && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${
            error.includes('failed') || error.includes('❌')
              ? 'bg-red-100 border border-red-400 text-red-700'
              : error.includes('Processing') || error.includes('🔄')
              ? 'bg-blue-100 border border-blue-400 text-blue-700'
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            <div className="flex items-center justify-between">
              <span>{error}</span>
              {!paymentLoading && !error.includes('✅') && (
                <button 
                  onClick={() => setError('')} 
                  className="ml-4 text-sm underline opacity-70 hover:opacity-100"
                >
                  Dismiss
                </button>
              )}
            </div>
            {paymentLoading && (
              <div className="mt-2 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                <span className="text-sm">Processing Stripe payment...</span>
              </div>
            )}
          </div>
        )}
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  step.id <= currentStep ? 'text-emerald-600' : 'text-gray-400'
                }`}>
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                    step.id < currentStep 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : step.id === currentStep
                      ? 'border-emerald-600 text-emerald-600 bg-emerald-50'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {step.id < currentStep ? (
                      <CheckIcon className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-semibold text-sm">{step.title}</div>
                    <div className="text-xs hidden sm:block">{step.description}</div>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`w-20 h-0.5 mx-4 ${
                    step.id < currentStep ? 'bg-emerald-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <ShippingStep 
                  checkoutData={checkoutData} 
                  updateCheckoutData={updateCheckoutData}
                  user={user}
                />
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <PaymentStep 
                  checkoutData={checkoutData} 
                  updateCheckoutData={updateCheckoutData}
                />
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <ReviewStep 
                  checkoutData={checkoutData}
                  cartItems={cartItems}
                  cartTotal={cartTotal}
                />
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                    currentStep === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-2" />
                  Previous
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={!validateStep(currentStep)}
                    className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
                      validateStep(currentStep)
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={placeOrder}
                    disabled={loading || paymentLoading}
                    className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                      loading || paymentLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {loading ? (
                      checkoutData.paymentMethod === 'stripe' ? 'Processing Payment...' : 'Placing Order...'
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: Shipping Information Component
const ShippingStep = ({ checkoutData, updateCheckoutData, user }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={checkoutData.shippingAddress.fullName}
            onChange={(e) => updateCheckoutData('shippingAddress.fullName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            value={checkoutData.shippingAddress.email}
            onChange={(e) => updateCheckoutData('shippingAddress.email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
          <input
            type="tel"
            value={checkoutData.shippingAddress.phone}
            onChange={(e) => updateCheckoutData('shippingAddress.phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
          <input
            type="text"
            value={checkoutData.shippingAddress.pincode}
            onChange={(e) => updateCheckoutData('shippingAddress.pincode', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
          <input
            type="text"
            value={checkoutData.shippingAddress.street}
            onChange={(e) => updateCheckoutData('shippingAddress.street', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
          <input
            type="text"
            value={checkoutData.shippingAddress.city}
            onChange={(e) => updateCheckoutData('shippingAddress.city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
          <input
            type="text"
            value={checkoutData.shippingAddress.state}
            onChange={(e) => updateCheckoutData('shippingAddress.state', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

// Step 2: Payment Method Component
const PaymentStep = ({ checkoutData, updateCheckoutData }) => {
  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when your order arrives',
      icon: '💵',
      benefits: 'No online charges • Secure • Pay after delivery'
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with Stripe (Test Mode)',
      icon: '💳',
      benefits: 'Instant confirmation • Test mode • No real charges'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
      
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
              checkoutData.paymentMethod === method.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300'
            }`}
            onClick={() => updateCheckoutData('paymentMethod', method.id)}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={checkoutData.paymentMethod === method.id}
                onChange={() => updateCheckoutData('paymentMethod', method.id)}
                className="h-4 w-4 text-emerald-600 mr-3"
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{method.name}</h3>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{method.benefits}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {checkoutData.paymentMethod === 'stripe' && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">🧪</span>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">Stripe Test Mode</h4>
              <div className="mt-1 text-sm text-blue-700">
                <p className="mb-2">This is a test integration for demonstration:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>No real money will be charged</li>
                  <li>Professional Stripe integration demo</li>
                  <li>Order will be created successfully</li>
                  <li>Perfect for portfolio/demo projects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes (Optional)</label>
        <textarea
          rows={3}
          value={checkoutData.orderNotes}
          onChange={(e) => updateCheckoutData('orderNotes', e.target.value)}
          placeholder="Special instructions for delivery..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
};

// Step 3: Order Review Component
const ReviewStep = ({ checkoutData, cartItems, cartTotal }) => {
  const tax = cartTotal * 0.18;
  const finalTotal = cartTotal + tax;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>
      
      {/* Shipping Address Review */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
        <p className="text-gray-700">
          {checkoutData.shippingAddress.fullName}<br />
          {checkoutData.shippingAddress.street}<br />
          {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state} - {checkoutData.shippingAddress.pincode}<br />
          Phone: {checkoutData.shippingAddress.phone}
        </p>
      </div>

      {/* Payment Method Review */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
        <div className="flex items-center">
          <span className="text-xl mr-2">
            {checkoutData.paymentMethod === 'cod' ? '💵' : '💳'}
          </span>
          <div>
            <p className="text-gray-700">
              {checkoutData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card (Stripe Test)'}
            </p>
            {checkoutData.paymentMethod === 'stripe' && (
              <p className="text-xs text-blue-600">Test mode - no real charges apply</p>
            )}
          </div>
        </div>
      </div>

      {/* Order Items Review */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <img
                  src={item.product.images?.[0]?.url || '/api/placeholder/60/60'}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold text-emerald-600">
                ₹{((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Total */}
      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <h3 className="font-semibold text-gray-900 mb-3">Order Total</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (18%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <hr className="border-emerald-200" />
          <div className="flex justify-between text-lg font-bold text-emerald-700">
            <span>Final Total</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Order Summary Sidebar Component
const OrderSummary = ({ cartItems, cartTotal }) => {
  const tax = cartTotal * 0.18;
  const total = cartTotal + tax;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="font-semibold text-green-600">FREE</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (18%)</span>
          <span className="font-semibold">₹{tax.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-emerald-600">₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Security Badge */}
      <div className="text-center text-sm text-gray-500 mb-4">
        🔒 Your payment information is secure
      </div>

      {/* Demo Notice */}
      <div className="text-center text-xs text-blue-600 bg-blue-50 p-2 rounded">
        🧪 Professional demo integration
      </div>
    </div>
  );
};

export default Checkout;
