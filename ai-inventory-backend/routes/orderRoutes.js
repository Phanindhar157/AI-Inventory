const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Order
router.post('/', authMiddleware, async (req, res) => {
  const { customerName, productId, quantity } = req.body;
  
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const totalPrice = product.price * quantity;

    const order = new Order({ customerName, product: productId, quantity, totalPrice });
    await order.save();
    
    // Update product quantity
    product.quantity -= quantity;
    await product.save();

    // Emit stock update to all connected clients
    req.app.get('io').emit('stockUpdated', productId);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
});

module.exports = router;
