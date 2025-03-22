const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Product
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, price, quantity, vendorId } = req.body;

  try {
    const product = new Product({ name, description, price, quantity, vendor: vendorId });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

// Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('vendor');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

module.exports = router;
