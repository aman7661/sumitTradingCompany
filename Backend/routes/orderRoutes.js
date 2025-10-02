const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

// Customer routes (require authentication)
router.use(protect);

// Customer order routes
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin-only routes
router.get('/admin/all', admin, orderController.getAllOrdersForAdmin);
router.get('/admin/stats', admin, orderController.getOrderStats);
router.get('/admin/:id', admin, orderController.getOrderForAdmin);
router.put('/admin/:id/status', admin, orderController.updateOrderStatus);
router.put('/admin/bulk-update', admin, orderController.bulkUpdateOrderStatus);

module.exports = router;
