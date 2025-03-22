const express = require('express');
const Vendor = require('../models/Vendor');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Create Vendor
router.post('/', authMiddleware, async (req, res) => {
  const { name, contactEmail, contactPhone, address } = req.body;

  try {
    const vendor = new Vendor({ name, contactEmail, contactPhone, address });
    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Error adding vendor', error });
  }
});

// Get All Vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error });
  }
});

module.exports = router;
