// src/data/products.js
const products = [
  {
    _id: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId
    name: 'Fresh Organic Apples',
    description: 'Crisp, sweet apples from local farms.',
    price: 120,
    discountPrice: 99,
    category: 'Fruits & Vegetables',
    brand: 'FarmFresh',
    unit: 'kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80' }
    ],
    ratings: { average: 4.8, count: 120 },
    stock: 50
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Desi Cow Milk',
    description: 'Pure, fresh cow milk delivered daily.',
    price: 60,
    discountPrice: 55,
    category: 'Dairy & Eggs',
    brand: 'MilkMan',
    unit: 'l',
    images: [
      { url: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }
    ],
    ratings: { average: 4.6, count: 80 },
    stock: 100
  },
  {
    _id: '507f1f77bcf86cd799439013',
    name: 'Premium Basmati Rice',
    description: 'Long grain, aromatic basmati rice.',
    price: 250,
    discountPrice: 199,
    category: 'Pantry Staples',
    brand: 'RoyalRice',
    unit: 'kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1464306076886-debede6bbf94?auto=format&fit=crop&w=400&q=80' }
    ],
    ratings: { average: 4.7, count: 60 },
    stock: 40
  },
  {
    _id: '507f1f77bcf86cd799439014',
    name: 'Farm Eggs (Dozen)',
    description: 'Fresh eggs from free-range hens.',
    price: 90,
    discountPrice: 80,
    category: 'Dairy & Eggs',
    brand: 'EggLand',
    unit: 'dozen',
    images: [
      { url: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }
    ],
    ratings: { average: 4.5, count: 45 },
    stock: 60
  },
  {
    _id: '507f1f77bcf86cd799439015',
    name: 'Classic Atta (Wheat Flour)',
    description: 'Stone-ground whole wheat flour.',
    price: 45,
    discountPrice: 39,
    category: 'Pantry Staples',
    brand: 'Shakti',
    unit: 'kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' }
    ],
    ratings: { average: 4.4, count: 30 },
    stock: 80
  },
  {
    _id: '507f1f77bcf86cd799439016',
    name: 'Premium Chicken Breast',
    description: 'Tender, skinless chicken breast.',
    price: 320,
    discountPrice: 299,
    category: 'Meat & Seafood',
    brand: 'MeatMaster',
    unit: 'kg',
    images: [
      { url: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }
    ],
    ratings: { average: 4.6, count: 70 },
    stock: 30
  }
];

export default products;
