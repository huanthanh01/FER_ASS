const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/badmintonshop';

const fs = require('fs');

const rawProducts = JSON.parse(fs.readFileSync('./badmintonshop.products.json', 'utf-8'));
const seedProducts = rawProducts.map(p => {
  if (p._id && p._id.$oid) p._id = p._id.$oid;
  if (p.createdAt && p.createdAt.$date) p.createdAt = p.createdAt.$date;
  if (p.updatedAt && p.updatedAt.$date) p.updatedAt = p.updatedAt.$date;
  return p;
});

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding database...');
    await Product.deleteMany({});
    const products = await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${products.length} products!`);
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
