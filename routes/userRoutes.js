const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const { getUserByEmail } = require("../controllers/userController");

const router = express.Router();

// POST /api/register
router.post('/register', registerUser);

// POST /api/login
router.post('/login', loginUser);

// Protected route for admin
router.get('/admin', protect(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin!' });
});

// Protected route for user
router.get('/user', protect(['user', 'admin']), (req, res) => {
  res.json({ message: 'Welcome User!' });
});

// Route to get user by email
router.get("/users", getUserByEmail);

module.exports = router;
