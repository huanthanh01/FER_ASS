const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Tab 1: Store Information
  storeName: {
    type: String,
    default: 'BadmintonShop'
  },
  storeEmail: {
    type: String,
    default: 'contact@badmintonshop.com'
  },
  storePhone: {
    type: String,
    default: '0123456789'
  },
  storeAddress: {
    type: String,
    default: '123 Badminton St, Sports City'
  },
  logoUrl: {
    type: String,
    default: ''
  },
  
  // Tab 2: Shipping & Tax
  standardShippingFee: {
    type: Number,
    default: 5.00
  },
  freeShippingThreshold: {
    type: Number,
    default: 100.00
  }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
