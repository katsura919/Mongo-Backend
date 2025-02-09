const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
