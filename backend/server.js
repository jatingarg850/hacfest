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
    
    console.log(`👤 ${userName} (${userId}) joined room: ${roomId}`);
    
    // Send recent messages
    try {
      const messages = await Message.find({ roomId })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean(); // Convert to plain objects
      
      const messagesArray = messages.reverse().map(msg => ({
        _id: msg._id.toString(),
        roomId: msg.roomId,
        userId: msg.userId,
        userName: msg.userName,
        content: msg.content,
        type: msg.type,
        createdAt: msg.createdAt,
      }));
      
      console.log(`📜 Sending ${messagesArray.length} previous messages to ${userName}`);
      socket.emit('previous-messages', messagesArray);
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      socket.emit('previous-messages', []);
    }
  });

  // Send message
  socket.on('send-message', async ({ roomId, content, type = 'text' }) => {
    try {
      console.log('📨 Received message:', { roomId, userId: socket.userId, userName: socket.userName, content });
      
      const message = new Message({
        roomId,
        userId: socket.userId,
        userName: socket.userName,
        content,
        type,
      });
      
      await message.save();
      
      // Convert to plain object for sending
      const messageObj = {
        _id: message._id.toString(),
        roomId: message.roomId,
        userId: message.userId,
        userName: message.userName,
        content: message.content,
        type: message.type,
        createdAt: message.createdAt,
      };
      
      console.log('✅ Broadcasting message to room:', roomId);
      io.to(roomId).emit('new-message', messageObj);
    } catch (error) {
      console.error('❌ Message error:', error);
      socket.emit('message-error', { error: error.message });
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
