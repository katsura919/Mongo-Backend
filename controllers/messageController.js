const Message = require('../models/Message');
const User = require('../models/User');
let io; // Store Socket.io instance

const setSocketInstance = (socketInstance) => {
  io = socketInstance;
};

const sendMessage = async (req, res) => {
    try {
      const { senderEmail, receiverEmail, text } = req.body;
  
      if (!senderEmail || !receiverEmail || !text) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Find users by their emails
      const sender = await User.findOne({ email: senderEmail });
      const receiver = await User.findOne({ email: receiverEmail });
  
      if (!sender || !receiver) {
        return res.status(404).json({ error: "Sender or Receiver not found" });
      }
  
      // Save message with their IDs
      const message = new Message({
        sender: sender._id,
        receiver: receiver._id,
        content: text,
      });
  
      await message.save();
  
      // Emit message via WebSocket
      if (io) {
        io.to(receiver._id.toString()).emit("receiveMessage", message);
      }
  
      res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: error.message || "Failed to send message" });
    }
  };
  
  

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Mark a message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndUpdate(messageId, { isRead: true }, { new: true });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
};

// Delete a message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

module.exports = { sendMessage, getMessages, markAsRead, deleteMessage, setSocketInstance };
