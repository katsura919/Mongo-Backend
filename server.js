const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server

// ✅ Middleware (CORS & JSON Parsing)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// ✅ Extra middleware to ensure CORS works properly
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ✅ Initialize Socket.io with proper CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// ✅ Routes
app.use("/api", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);

// ✅ WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);

  // 🔹 Join user-specific room using email
  socket.on("joinRoom", (userEmail) => {
    if (userEmail) {
      socket.join(userEmail);
      console.log(`✅ User ${userEmail} joined room`);
      socket.emit("roomJoined", userEmail); // Confirmation to the client
    }
  });

  // 🔹 Listen for messages & send to the recipient's room
  socket.on("sendMessage", (message) => {
    console.log("📩 New message:", message);

  
    io.to(message.receiverEmail).emit("receiveMessage", message);

  });

  // 🔹 Handle disconnects & remove from rooms
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);

    // Find and remove user from rooms
    for (const [room, sockets] of io.sockets.adapter.rooms) {
      if (sockets.has(socket.id)) {
        console.log(`🚪 User left room: ${room}`);
        socket.leave(room);
      }
    }
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
