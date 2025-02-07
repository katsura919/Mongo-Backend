const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],  // Validation: email must be provided
    unique: true,                          // Email must be unique
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],  // Email format validation
  },
  password: {
    type: String,
    required: [true, 'Password is required'],  // Validation: password must be provided
  },
  role: {
    type: String,
    enum: ['user', 'admin'],   // Only 'user' or 'admin' roles allowed
    default: 'user',           // Default role is 'user'
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
