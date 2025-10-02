const Order = require('../models/Order');

// Create Stripe payment intent
exports.createStripePayment = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount, currency = 'inr' } = req.body;

    console.log('🔑 Stripe key available:', !!process.env.STRIPE_SECRET_KEY);
    console.log('🎯 Creating Stripe payment intent for amount:', amount);

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Stripe configuration error: Secret key not found'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in paise/cents
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration_check: 'accept_a_payment',
        user_id: req.user.id
      }
    });

    console.log('✅ Stripe payment intent created:', paymentIntent.id);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('❌ Error creating Stripe payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
};

// Create order with test Stripe payment (for demo purposes)
exports.createTestStripeOrder = async (req, res) => {
  try {
    const { orderData } = req.body;
    
    console.log('🧪 Creating test Stripe order (no real payment)');

    // Create order in database with test payment status
    const transformedItems = orderData.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity
    }));

    const calculatedTotal = transformedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `STC${String(count + 1).padStart(6, '0')}`;

    const newOrder = new Order({
      orderNumber: orderNumber,
      items: transformedItems,
      total: calculatedTotal,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: 'stripe',
      orderNotes: orderData.orderNotes || '',
      user: req.user.id,
      // Test payment details
      paymentStatus: 'paid',
      stripePaymentIntentId: `test_${Date.now()}`
    });

    await newOrder.save();
    await newOrder.populate('items.product');

    console.log('🎉 Test Stripe order created successfully:', newOrder.orderNumber);

    res.json({
      success: true,
      message: 'Test Stripe payment successful and order created!',
      order: newOrder
    });

  } catch (error) {
    console.error('❌ Error creating test Stripe order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test order',
      error: error.message
    });
  }
};

// Verify real Stripe payment (for production use)
exports.verifyStripePayment = async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { 
      paymentIntentId,
      orderData 
    } = req.body;

    console.log('🔍 Verifying real Stripe payment:', paymentIntentId);

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Stripe configuration error: Secret key not found'
      });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
        status: paymentIntent.status
      });
    }

    console.log('✅ Real Stripe payment verified successfully');

    // Create order in database
    const transformedItems = orderData.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity
    }));

    const calculatedTotal = transformedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `STC${String(count + 1).padStart(6, '0')}`;

    const newOrder = new Order({
      orderNumber: orderNumber,
      items: transformedItems,
      total: calculatedTotal,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: 'stripe',
      orderNotes: orderData.orderNotes || '',
      user: req.user.id,
      // Real Stripe payment details
      paymentStatus: 'paid',
      stripePaymentIntentId: paymentIntentId
    });

    await newOrder.save();
    await newOrder.populate('items.product');

    console.log('🎉 Order created with real Stripe payment:', newOrder.orderNumber);

    res.json({
      success: true,
      message: 'Payment successful and order created!',
      order: newOrder
    });

  } catch (error) {
    console.error('❌ Error verifying Stripe payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};
