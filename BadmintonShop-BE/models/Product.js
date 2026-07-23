const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  oldPrice: {
    type: Number
  },
  images: [{
    type: String,
    required: true
  }],
  badge: {
    type: String
  },
  badgeColor: {
    type: String
  },
  badgeTextColor: {
    type: String
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true,
    default: 'Uncategorized'
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  weight: {
    type: String,
    required: false
  },
  stiffness: {
    type: String,
    required: false
  },
  balance: {
    type: String,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
