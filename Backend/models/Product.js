const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
  type: Number,
  min: [0, 'Discount price cannot be negative'],
  validate: {
    validator: function(value) {
      return !value || value <= this.price;
    },
    message: 'Discount price must be less than or equal to regular price'
  }
},

  category: {
  type: String,
  required: [true, 'Category is required'],
  enum: [
    'Pooja Needs',
    'Cooking Essentials', 
    'Snacks & Namkeens',
    'Home Cleaning',
    'Disposables',
    'Dairy & Beverages',
    'Grains & Pulses',
    'Spices & Seasonings',
    'Oil & Ghee',
    'Baking Essentials',
    'Health & Wellness',
    'Baby Care',
    'Personal Care',
    'Kitchen Utensils'
  ]
},

  subcategory: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'piece', 'pack', 'dozen']
  },
  images: [{
    public_id: String,
    url: String
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  tags: [String],
  expiryDate: Date,
  manufacturer: String
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function() {
  return this.discountPrice || this.price;
});

module.exports = mongoose.model('Product', productSchema);
