const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// WebSocket connection handling
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('user-joined', (userData) => {
    activeUsers.set(socket.id, userData);
    io.emit('user-list', Array.from(activeUsers.values()));
    io.emit('user-activity', {
      type: 'joined',
      user: userData,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('student-updated', (data) => {
    socket.broadcast.emit('student-updated', data);
  });

  socket.on('student-created', (data) => {
    io.emit('student-created', data);
  });

  socket.on('student-deleted', (data) => {
    io.emit('student-deleted', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('user-typing', { userId: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    const userData = activeUsers.get(socket.id);
    if (userData) {
      activeUsers.delete(socket.id);
      io.emit('user-list', Array.from(activeUsers.values()));
      io.emit('user-activity', {
        type: 'left',
        user: userData,
        timestamp: new Date().toISOString()
      });
    }
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));