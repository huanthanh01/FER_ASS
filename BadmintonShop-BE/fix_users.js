const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/badmintonshop';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Deleting old users...');
    await User.deleteMany({});
    
    const fs = require('fs');
    const path = require('path');
    
    // Read JSON file
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../badmintonshop.users.json'), 'utf8'));
    
    // Map data to remove $oid and $date wrappers that MongoDB dump creates
    const cleanedUsers = usersData.map(user => {
      const cleaned = { ...user };
      if (cleaned._id && cleaned._id.$oid) {
        cleaned._id = cleaned._id.$oid;
      }
      if (cleaned.createdAt && cleaned.createdAt.$date) {
        cleaned.createdAt = new Date(cleaned.createdAt.$date);
      }
      if (cleaned.updatedAt && cleaned.updatedAt.$date) {
        cleaned.updatedAt = new Date(cleaned.updatedAt.$date);
      }
      return cleaned;
    });

    console.log(`Inserting ${cleanedUsers.length} users...`);
    await User.insertMany(cleanedUsers);
    
    console.log('Successfully deleted all old users and inserted the new users from JSON.');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
