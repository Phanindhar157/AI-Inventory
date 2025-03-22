const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
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
  businessType: {
    type: String,
    required: true,
    enum: ['Individual', 'Small Business', 'Artisan', 'Local Producer']
  },
  sustainabilityProfile: {
    ecoFriendly: Boolean,
    sustainablePractices: [String],
    certifications: [String],
    carbonNeutral: Boolean
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    website: String
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  active: {
    type: Boolean,
    default: true
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
vendorSchema.index({ location: '2dsphere' });

// Update the updatedAt timestamp before saving
vendorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
