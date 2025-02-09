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

// ✅ Middleware - Place before defining Socket.io
app.use(cors({
  origin: "https://mongo-next-js-rytq.vercel.app",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// ✅ Initialize Socket.io with proper CORS settings
const io = new Server(server, {
  cors: {
    origin: "https://mongo-next-js-rytq.vercel.app",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});

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
