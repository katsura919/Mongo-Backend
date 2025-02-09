const express = require('express');
const { createConversation, getUserConversations } = require('../controllers/conversationController');

const router = express.Router();

// Create a new conversation
router.post('/', createConversation);

// Get all conversations for a specific user
router.get('/:userId', getUserConversations);

module.exports = router;
