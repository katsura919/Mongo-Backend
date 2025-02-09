const express = require('express');
const router = express.Router();
const {sendMessage, getMessages, markAsRead, deleteMessage} = require('../controllers/messageController');

router.post('/send', sendMessage);

router.get('/:user1/:user2', getMessages);

router.patch('/read/:messageId', markAsRead);

router.delete('/:messageId', deleteMessage);

module.exports = router;
