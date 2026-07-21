const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server & Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/badmintonshop';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const revenueRoutes = require('./routes/revenue');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/reports', require('./routes/report'));

// Socket.io logic
const Report = require('./models/Report');

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // User/Admin joins a room (room = userId)
  socket.on('joinRoom', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on('sendMessage', async (data) => {
    try {
      // data: { senderId, receiverId (userId for admin), isAdmin, content }
      // If isAdmin is false, the room is senderId. If isAdmin is true, the room is receiverId.
      const userId = data.isAdmin ? data.receiverId : data.senderId;
      
      let report = await Report.findOne({ user: userId });
      if (!report) {
        report = new Report({ user: userId, messages: [] });
      }

      const newMessage = {
        sender: data.senderId,
        isAdmin: data.isAdmin,
        content: data.content,
        createdAt: new Date()
      };

      report.messages.push(newMessage);
      
      if (data.isAdmin) {
        report.hasUnreadUser = true;
      } else {
        report.hasUnreadAdmin = true;
      }
      report.lastUpdatedAt = new Date();
      await report.save();
      
      // Populate sender before emitting to get name
      await report.populate('messages.sender', 'fullname username');
      const savedMessage = report.messages[report.messages.length - 1];

      // Broadcast to the user's room
      io.to(userId).emit('newMessage', { message: savedMessage, userId });
      
      // Broadcast to admins
      io.emit('adminUpdate', { reportId: report._id, userId, message: savedMessage });
      
    } catch (error) {
      console.error('Socket send message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
