const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/badmintonshop';

const seedProducts = [
  {
    brand: 'Yonex',
    name: 'Astrox 100 ZZ Kurenai',
    description: 'Advanced attacking racket. The flagship heavy-head racket designed for explosive power and fast recovery.',
    price: 229.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    badge: 'Pro Choice',
    badgeColor: '#ff6b00',
    badgeTextColor: '#561f00',
    isFeatured: true,
    stock: 50,
    category: 'RACKET'
  },
  {
    brand: 'Victor',
    name: 'Thruster F Claw',
    description: 'Power and precision',
    price: 205.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 50,
    category: 'RACKET'
  },
  {
    brand: 'Li-Ning',
    name: 'Falcon Pro Court Shoes',
    description: 'Lightweight court shoes',
    price: 144.00,
    oldPrice: 180.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    badge: 'Sale -20%',
    badgeColor: '#93000a',
    badgeTextColor: '#ffdad6',
    isFeatured: false,
    stock: 50,
    category: 'SHOES'
  },
  {
    brand: 'Yonex',
    name: 'AS-50 Feather Shuttles',
    description: 'Tournament grade shuttles',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 50,
    category: 'ACCESSORIES'
  },
  {
    brand: 'Yonex',
    name: 'Pro Tournament Jersey',
    description: 'Breathable activewear',
    price: 65.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 50,
    category: 'SHIRTS'
  },
  {
    brand: 'Victor',
    name: 'BR9213 12-Pack Bag',
    description: 'Spacious racket bag',
    price: 115.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 50,
    category: 'BAGS'
  },
  {
    brand: 'Mizuno',
    name: 'Wave Momentum 3',
    description: 'Ultimate stability and comfort for multi-directional court movements.',
    price: 159.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: true,
    stock: 50,
    category: 'SHOES'
  },
  {
    brand: 'Li-Ning',
    name: 'G900 Feather',
    description: 'Tournament grade goose feathers for precise flight and durability.',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: true,
    stock: 50,
    category: 'ACCESSORIES'
  },
  {
    brand: 'Yonex',
    name: 'Nanoflare 800',
    description: 'Head-light racket designed for incredibly fast swings.',
    price: 210.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 50,
    category: 'RACKET'
  },
  {
    brand: 'Victor',
    name: 'A930 Indoor Court Shoes',
    description: 'High-performance shoes with excellent shock absorption.',
    price: 135.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 50,
    category: 'SHOES'
  },
  {
    brand: 'Yonex',
    name: 'BG80 Badminton String',
    description: 'High-repulsion power and hard feeling.',
    price: 12.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 200,
    category: 'ACCESSORIES'
  },
  {
    brand: 'Li-Ning',
    name: 'Aeronaut 9000',
    description: 'Combines power with control through an innovative air-stream channel design.',
    price: 240.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    badge: 'Bestseller',
    badgeColor: '#008000',
    badgeTextColor: '#ffffff',
    isFeatured: true,
    stock: 30,
    category: 'RACKET'
  },
  {
    brand: 'Yonex',
    name: 'Power Cushion 65 Z3',
    description: 'Popular all-around badminton shoe used by professionals worldwide.',
    price: 145.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 60,
    category: 'SHOES'
  },
  {
    brand: 'Yonex',
    name: 'Mavis 350 Nylon Shuttles',
    description: 'Durable nylon shuttles designed to mimic feather flight performance.',
    price: 18.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 150,
    category: 'ACCESSORIES'
  },
  {
    brand: 'Victor',
    name: 'DriveX 9X',
    description: 'Even-balance racket providing smooth handling and effortless power.',
    price: 195.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 45,
    category: 'RACKET'
  },
  {
    brand: 'Li-Ning',
    name: 'Racket Grip Tape (Pack of 3)',
    description: 'Comfortable and absorbent overgrip.',
    price: 9.50,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 300,
    category: 'ACCESSORIES'
  },
  {
    brand: 'Yonex',
    name: 'Pro Backpack M',
    description: 'Compact and convenient backpack for 2 rackets and gear.',
    price: 75.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 40,
    category: 'BACKPACKS'
  },
  {
    brand: 'Victor',
    name: 'S-7004 Shorts',
    description: 'Breathable and lightweight playing shorts.',
    price: 35.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 80,
    category: 'SHORTS'
  },
  {
    brand: 'Yonex',
    name: 'ArcSaber 11 Pro',
    description: 'Precise control and solid feel for all-around play.',
    price: 235.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    badge: 'New',
    badgeColor: '#0055ff',
    badgeTextColor: '#ffffff',
    isFeatured: true,
    stock: 35,
    category: 'RACKET'
  },
  {
    brand: 'Li-Ning',
    name: 'Halberd III Shoes',
    description: 'Excellent court grip and lateral support.',
    price: 110.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 55,
    category: 'SHOES'
  },
  {
    brand: 'Yonex',
    name: 'Tournament Skirt',
    description: 'Comfortable fit for unrestricted movement.',
    price: 40.00,
    images: ['https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop'],
    isFeatured: false,
    stock: 50,
    category: 'SKIRTS'
  }
];

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
