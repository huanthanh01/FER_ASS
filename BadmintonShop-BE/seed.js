const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/badmintonshop';

const seedProductsRaw = require('./badmintonshop.products.json');

const seedProducts = seedProductsRaw.map(item => {
  const product = { ...item };
  // Remove MongoDB specific fields so Mongoose can generate new ones or use defaults
  delete product._id;
  delete product.__v;
  delete product.createdAt;
  delete product.updatedAt;
  return product;
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
