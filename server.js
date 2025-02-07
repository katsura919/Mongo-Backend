const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes'); // Import your routes

dotenv.config();
connectDB();

const app = express();

// Use CORS middleware to allow requests from your frontend (localhost:3000)
app.use(cors());

// Middleware to parse incoming JSON data
app.use(express.json());

// Use routes
app.use('/api', userRoutes);  // Update your route as necessary

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
