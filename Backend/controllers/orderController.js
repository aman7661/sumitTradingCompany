const Order = require('../models/Order');

// Existing functions stay the same...
// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create new order (existing function stays the same)
exports.createOrder = async (req, res) => {
  try {
    console.log('📝 Creating order with data:', JSON.stringify(req.body, null, 2));
    console.log('👤 User ID:', req.user.id);
    
    const transformedItems = req.body.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.discountPrice || item.product.price,
      quantity: item.quantity
    }));
    
    const calculatedTotal = transformedItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    const count = await Order.countDocuments();
    const orderNumber = `STC${String(count + 1).padStart(6, '0')}`;
    console.log('🔢 Generated order number:', orderNumber);
    
    const orderData = {
      orderNumber: orderNumber,
      items: transformedItems,
      total: req.body.total || calculatedTotal,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      orderNotes: req.body.orderNotes || '',
      user: req.user.id
    };
    
    console.log('🔄 Transformed order data:', JSON.stringify(orderData, null, 2));
    
    const order = new Order(orderData);
    
    await order.save();
    console.log('✅ Order saved successfully with ID:', order._id);
    console.log('✅ Order number:', order.orderNumber);
    
    await order.populate('items.product');
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.log('❌ Error creating order:', error.message);
    console.log('❌ Full error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Cancel order (existing function stays the same)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    if (['delivered', 'shipped'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled'
      });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order'
    });
  }
};

// ===== NEW ADMIN FUNCTIONS =====

// Get all orders for admin
exports.getAllOrdersForAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const totalOrders = await Order.countDocuments(query);
    
    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders
      }
    });
  } catch (error) {
    console.error('Error fetching orders for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders'
    });
  }
};

// Get single order for admin
exports.getOrderForAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate('items.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Update status
    order.status = status;
    
    // Add tracking number if provided
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }
    
    await order.save();
    
    console.log(`📦 Order ${order.orderNumber} status updated to: ${status} by admin: ${req.user.name}`);
    
    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Bulk update order statuses (Admin only)
exports.bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds, status } = req.body;
    
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order IDs are required'
      });
    }
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const result = await Order.updateMany(
      { _id: { $in: orderIds } },
      { status: status }
    );
    
    console.log(`📦 Bulk updated ${result.modifiedCount} orders to status: ${status} by admin: ${req.user.name}`);
    
    res.json({
      success: true,
      message: `${result.modifiedCount} orders updated to ${status}`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error bulk updating orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update orders'
    });
  }
};

// Get order statistics for admin dashboard
exports.getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$total' }
        }
      }
    ]);
    
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      stats: {
        statusBreakdown: stats,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order statistics'
    });
  }
};
