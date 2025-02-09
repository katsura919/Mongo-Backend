const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  profilePicture: {
    type: String, // URL to the profile picture
    default: 'default-profile.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  onlineStatus: {
    type: Boolean,
    default: false // False = Offline, True = Online
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  friends: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  socketId: {
    type: String, // Stores the user's WebSocket ID for real-time communication
    default: null
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
