const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// All payment routes require authentication
router.use(protect);

// Stripe payment routes
router.post('/create-stripe-intent', paymentController.createStripePayment);
router.post('/verify-stripe', paymentController.verifyStripePayment);
router.post('/create-test-stripe-order', paymentController.createTestStripeOrder); // For demo

module.exports = router;
