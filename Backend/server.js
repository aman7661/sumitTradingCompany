const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const paymentRoutes = require('./routes/paymentRoutes');


// Import routes (ONLY ONCE - moved after other imports)
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Add this line

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((error) => console.error('❌ MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Add this line

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Sumit Trading Company API is running!',
    timestamp: new Date().toISOString()
  });
});

//Payment
app.use('/api/payments', paymentRoutes);

// Add this test route after your other routes
app.get('/api/test-stripe', (req, res) => {
  res.json({
    stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
    keyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10),
    allEnvVars: Object.keys(process.env).filter(key => key.includes('STRIPE'))
  });
});


// Socket.io
io.on('connection', (socket) => {
  console.log('🔗 User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Sumit Trading Company server running on port ${PORT}`);
});

module.exports = { app, io };
