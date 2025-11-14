require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./src/config/database');
const routes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');
const Message = require('./src/models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handler
app.use(errorHandler);

// Socket.io for community chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join room
  socket.on('join-room', async ({ roomId, userId, userName }) => {
    socket.join(roomId);
    socket.userId = userId;
    socket.userName = userName;
    socket.roomId = roomId;
    
    console.log(`${userName} joined room: ${roomId}`);
    
    // Send recent messages
    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'name');
    
    socket.emit('previous-messages', messages.reverse());
  });

  // Send message
  socket.on('send-message', async ({ roomId, content, type = 'text' }) => {
    try {
      const message = new Message({
        roomId,
        userId: socket.userId,
        userName: socket.userName,
        content,
        type,
      });
      
      await message.save();
      
      io.to(roomId).emit('new-message', message);
    } catch (error) {
      console.error('Message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
});
