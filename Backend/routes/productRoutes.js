const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Public routes - for customers (only show active products)
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/:id', productController.getProduct);

// Admin routes - IMPORTANT: More specific routes FIRST
router.get('/admin/all', protect, admin, productController.getAllProductsForAdmin); // NEW separate endpoint
router.put('/:id/toggle', protect, admin, productController.toggleProductVisibility);
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
