const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Second-Hand', 'Upcycled', 'Local', 'Handmade', 'Vintage']
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor']
  },
  images: [{
    url: String,
    publicId: String,
    aiTags: [String], // AI-generated tags for the image
    sustainabilityScore: Number // AI-generated sustainability score
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  sustainabilityMetrics: {
    carbonFootprint: Number,
    waterUsage: Number,
    materials: [String],
    recyclability: Number
  },
  demandPrediction: {
    predictedDemand: Number,
    confidence: Number,
    lastUpdated: Date
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
productSchema.index({ location: '2dsphere' });

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
