const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Import HTTP module
const { Server } = require('socket.io'); // Import Socket.io
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes'); 
const messageRoutes = require('./routes/messageRoutes');
const conversationRoutes = require('./routes/conversationRoutes');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


app.use(express.json());

// Routes
app.use('/api', userRoutes);  
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);


// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a specific room (user-based messaging)
  socket.on("joinRoom", (userEmail) => {
    socket.join(userEmail);
    console.log(`User ${userEmail} joined room`);
  });

  // Listen for new messages
  socket.on("sendMessage", (message) => {
    console.log("New message:", message);

    // Send message to the receiver's room
    io.to(message.receiverEmail).emit("receiveMessage", message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
