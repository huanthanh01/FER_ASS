const mongoose = require('mongoose');
const Product = require('./models/Product');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/badmintonshop';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Starting database specs update...');

    // 1. Read JSON file
    const jsonPath = path.join(__dirname, 'badmintonshop.products.json');
    if (!fs.existsSync(jsonPath)) {
      console.error(`Seed file not found at: ${jsonPath}`);
      mongoose.connection.close();
      return;
    }
    
    const rawProducts = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    let updatedCount = 0;

    // 2. Iterate and determine specs
    const updatedProducts = rawProducts.map(p => {
      if (p.category && p.category.toUpperCase() === 'RACKET') {
        const nameLower = (p.name || '').toLowerCase();
        const descLower = (p.description || '').toLowerCase();

        // Stiffness
        let stiffness = 'Medium';
        if (nameLower.includes('100 zz') || nameLower.includes('100zz') || nameLower.includes('pro') || descLower.includes('extra stiff')) {
          stiffness = 'Extra Stiff';
        } else if (nameLower.includes('game') || nameLower.includes('play') || nameLower.includes('flex') || descLower.includes('flexible')) {
          stiffness = 'Flexible';
        } else if (nameLower.includes('tour') || nameLower.includes('stiff')) {
          stiffness = 'Stiff';
        }

        // Balance
        let balance = 'Even Balance';
        if (nameLower.includes('astrox') || nameLower.includes('thruster') || nameLower.includes('ryuga') || descLower.includes('head heavy') || descLower.includes('power')) {
          balance = 'Head Heavy';
        } else if (nameLower.includes('nanoflare') || nameLower.includes('sonic') || nameLower.includes('light') || descLower.includes('head light') || descLower.includes('speed')) {
          balance = 'Head Light';
        } else if (nameLower.includes('arcsaber') || nameLower.includes('duora') || descLower.includes('control') || descLower.includes('even')) {
          balance = 'Even Balance';
        }

        // Weight
        let weight = '4U (Avg. 83g)';
        if (nameLower.includes('100 zz') || nameLower.includes('100zz') || nameLower.includes('3u') || nameLower.includes('claws')) {
          weight = '3U (Avg. 88g)';
        } else if (nameLower.includes('light') || nameLower.includes('5u')) {
          weight = '5U (Avg. 78g)';
        }

        p.stiffness = stiffness;
        p.balance = balance;
        p.weight = weight;
        updatedCount++;
      }
      return p;
    });

    // 3. Write back to JSON file
    fs.writeFileSync(jsonPath, JSON.stringify(updatedProducts, null, 2), 'utf-8');
    console.log(`Updated JSON seed file: added specs to ${updatedCount} rackets.`);

    // 4. Update MongoDB records
    for (const prod of updatedProducts) {
      const id = prod._id && prod._id.$oid ? prod._id.$oid : prod._id;
      if (prod.category && prod.category.toUpperCase() === 'RACKET') {
        await Product.findByIdAndUpdate(
          id,
          {
            stiffness: prod.stiffness,
            balance: prod.balance,
            weight: prod.weight
          },
          { new: true }
        );
      }
    }
    console.log('Successfully updated specs in MongoDB!');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB error:', err);
  });
