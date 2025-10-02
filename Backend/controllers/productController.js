const Product = require('../models/Product'); 

// Get all products for admin - ALWAYS shows ALL products regardless of isActive
exports.getAllProductsForAdmin = async (req, res) => {
  try {
    console.log('🔍 Admin fetching ALL products (including hidden)');
    
    // NO FILTER - Show all products for admin
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    console.log('🔍 Found', products.length, 'total products');
    console.log('🔍 Hidden products:', products.filter(p => p.isActive === false).length);
    console.log('🔍 Visible products:', products.filter(p => p.isActive !== false).length);
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching products for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get products for customers - ONLY shows active products
exports.getProducts = async (req, res) => {
  try {
    console.log('🔍 Customer fetching only active products');
    
    // FILTER - Only show active products for customers
    const products = await Product.find({ isActive: { $ne: false } }).sort({ createdAt: -1 });
    
    console.log('🔍 Found', products.length, 'active products for customers');
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    console.log('📝 Creating product with data:', req.body);
    
    const product = new Product(req.body);
    console.log('🔄 Product instance created');
    
    const savedProduct = await product.save();
    console.log('✅ Product saved to MongoDB with ID:', savedProduct._id);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct
    });
  } catch (error) {
    console.log('❌ Error creating product:', error.message);
    
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
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log('✏️ Product updated:', product.name);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.log('🗑️ Product deleted:', product.name);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product'
    });
  }
};

// Toggle product visibility
exports.toggleProductVisibility = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Toggle the isActive status
    product.isActive = !product.isActive;
    await product.save();
    
    console.log('👁️ Product visibility toggled:', product.name, 'isActive:', product.isActive);
    
    res.json({
      success: true,
      message: `Product ${product.isActive ? 'shown' : 'hidden'} successfully`,
      product
    });
  } catch (error) {
    console.error('Error toggling visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle product visibility'
    });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      isActive: { $ne: false } 
    }).limit(8);
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured products'
    });
  }
};
