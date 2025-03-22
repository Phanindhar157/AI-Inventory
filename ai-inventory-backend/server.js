const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/db');
const aiService = require('./services/aiService');
const socialMediaService = require('./services/socialMediaService');
const locationService = require('./services/locationService');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logging
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Initialize services
const initializeServices = async () => {
  try {
    await aiService.initialize();
    await socialMediaService.initialize();
    await locationService.initialize();
    console.log('All services initialized successfully');
  } catch (error) {
    console.error('Error initializing services:', error);
    process.exit(1);
  }
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle real-time inventory updates
  socket.on('inventoryUpdate', async (data) => {
    try {
      // Update inventory in database
      const updatedProduct = await Product.findByIdAndUpdate(
        data.productId,
        { quantity: data.quantity },
        { new: true }
      );

      // Broadcast update to all connected clients
      io.emit('inventoryUpdated', updatedProduct);

      // Sync with social media if needed
      if (data.syncSocialMedia) {
        await socialMediaService.syncInventory(updatedProduct);
      }
    } catch (error) {
      console.error('Error handling inventory update:', error);
      socket.emit('error', { message: 'Failed to update inventory' });
    }
  });

  // Handle location updates
  socket.on('locationUpdate', async (data) => {
    try {
      const updatedLocation = await locationService.updateLocation(
        data.productId,
        data.coordinates
      );
      io.emit('locationUpdated', updatedLocation);
    } catch (error) {
      console.error('Error handling location update:', error);
      socket.emit('error', { message: 'Failed to update location' });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5002;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeServices();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => process.exit(1));
});
