const L = require('leaflet');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');

class LocationService {
  constructor() {
    this.map = null;
  }

  async initialize() {
    try {
      // Initialize map with default center
      this.map = L.map('map').setView([0, 0], 2);
      
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    } catch (error) {
      console.error('Error initializing location service:', error);
      throw error;
    }
  }

  async updateLocation(productId, coordinates) {
    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        {
          location: {
            type: 'Point',
            coordinates: coordinates
          }
        },
        { new: true }
      );

      return product;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  async findNearbyProducts(coordinates, radiusInKm) {
    try {
      const products = await Product.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            $maxDistance: radiusInKm * 1000 // Convert km to meters
          }
        }
      }).populate('vendor');

      return products;
    } catch (error) {
      console.error('Error finding nearby products:', error);
      throw error;
    }
  }

  async findNearbyVendors(coordinates, radiusInKm) {
    try {
      const vendors = await Vendor.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: coordinates
            },
            $maxDistance: radiusInKm * 1000
          }
        }
      });

      return vendors;
    } catch (error) {
      console.error('Error finding nearby vendors:', error);
      throw error;
    }
  }

  async calculateDistance(coord1, coord2) {
    try {
      const lat1 = coord1[1];
      const lon1 = coord1[0];
      const lat2 = coord2[1];
      const lon2 = coord2[0];

      const R = 6371; // Earth's radius in km
      const dLat = this.toRad(lat2 - lat1);
      const dLon = this.toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance;
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }

  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  async getOptimalRoute(vendorId, deliveryPoints) {
    try {
      // Implement route optimization algorithm
      // This is a placeholder for the actual implementation
      return {
        route: deliveryPoints,
        totalDistance: 0,
        estimatedTime: 0
      };
    } catch (error) {
      console.error('Error calculating optimal route:', error);
      throw error;
    }
  }

  async updateVendorLocation(vendorId, coordinates) {
    try {
      const vendor = await Vendor.findByIdAndUpdate(
        vendorId,
        {
          location: {
            type: 'Point',
            coordinates: coordinates
          }
        },
        { new: true }
      );

      return vendor;
    } catch (error) {
      console.error('Error updating vendor location:', error);
      throw error;
    }
  }

  async getLocationStats() {
    try {
      const stats = {
        totalProducts: await Product.countDocuments(),
        totalVendors: await Vendor.countDocuments(),
        averageDistance: 0,
        coverageArea: 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting location stats:', error);
      throw error;
    }
  }

  async cleanup() {
    if (this.map) {
      this.map.remove();
    }
  }
}

module.exports = new LocationService(); 