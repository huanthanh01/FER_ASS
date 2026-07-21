const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const Order = require('./models/Order');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/badmintonshop';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Seeding user data...');
    
    const user = await User.findOne({ email: 'sonicprime1963@gmail.com' });
    if (!user) {
      console.log('User not found!');
      return;
    }
    
    const products = await Product.find().limit(3);
    if (products.length === 0) {
      console.log('No products found!');
      return;
    }
    
    // Clear existing cart and orders for user to prevent duplicates
    await Cart.deleteMany({ user: user._id });
    await Order.deleteMany({ user: user._id });
    
    // Create Cart
    const cart = new Cart({
      user: user._id,
      items: [
        { product: products[0]._id, quantity: 2 },
        { product: products[1]._id, quantity: 1 }
      ]
    });
    await cart.save();
    console.log('Cart seeded.');
    
    // Create Order
    const order = new Order({
      user: user._id,
      items: [
        { product: products[0]._id, quantity: 1, priceAtPurchase: products[0].price },
        { product: products[2]._id, quantity: 2, priceAtPurchase: products[2].price }
      ],
      totalAmount: products[0].price * 1 + products[2].price * 2,
      shippingAddress: {
        street: '123 Main St',
        city: 'Metropolis',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      paymentStatus: 'Completed',
      orderStatus: 'Processing'
    });
    await order.save();
    console.log('Order seeded.');
    
    console.log('User data seeded successfully!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
