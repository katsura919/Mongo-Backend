const Conversation = require('../models/Conversation');
const User = require('../models/User');

// Create a new conversation (if it doesn't exist)
const createConversation = async (req, res) => {
    try {
      const { senderUsername, receiverUsername } = req.body;
  
      if (!senderUsername || !receiverUsername) {
        return res.status(400).json({ error: "Both senderUsername and receiverUsername are required" });
      }
  
      // Find users based on their usernames
      const sender = await User.findOne({ username: senderUsername });
      const receiver = await User.findOne({ username: receiverUsername });
  
      if (!sender || !receiver) {
        return res.status(404).json({ error: "One or both users not found" });
      }
  
      // Check if conversation already exists
      const conversation = await Conversation.findOne({
        participants: { $all: [sender._id, receiver._id] },
      });
  
      if (!conversation) {
        const newConversation = new Conversation({ participants: [sender._id, receiver._id] });
        await newConversation.save();
        return res.status(201).json(newConversation);
      }
  
      res.status(200).json(conversation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating conversation" });
    }
  };
  
  

// Get all conversations for a user
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'name email') // Populate participant details
      .populate('lastMessage'); // Populate last message

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching conversations' });
  }
};

// Update the last message in a conversation
const updateLastMessage = async (messageId, senderId, receiverId) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { participants: { $all: [senderId, receiverId] } },
      { lastMessage: messageId, lastUpdated: Date.now() },
      { new: true }
    );

    return conversation;
  } catch (error) {
    console.error('Error updating last message:', error);
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  updateLastMessage
};
