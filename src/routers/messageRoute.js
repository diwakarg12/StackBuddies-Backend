// messageRouter.js
const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const messageRouter = express.Router();
const mongoose = require('mongoose');
const { getIO, getConnectedUsers } = require('../socket/socket.server')

messageRouter.post('/send', userAuth, async (req, res) => {
    try {
        const { message, _id } = req.body;

        if (!message || message.trim() === "") {
            return res.status(402).json({ message: "No Content Sent" });
        }

        const receiver = await User.findById(_id);
        if (!receiver) {
            return res.status(402).json({ message: "User unavailable" });
        }

        // Save the new message to the database
        const newMessage = await Message.create({
            sender: req.user._id,
            receiver: _id,
            content: message,
        });

        const io = getIO();
        const connectedUsers = getConnectedUsers();
        const receiverSocketId = connectedUsers.get(_id);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", {
                _id: newMessage._id,
                sender: req.user._id,
                content: newMessage.content,
                createdAt: newMessage.createdAt,
            });
        }

        res.status(200).json({ message: "Message sent", message: newMessage.content });
    } catch (error) {
        res.status(500).json({ message: "Error:", error: error.message });
    }
});

messageRouter.get('/getConversation/:fromUserId', userAuth, async (req, res) => {
    try {
        const senderId = req.params.fromUserId;
        const receiverId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({ message: "Invalid senderId format" });
        }

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ message: "Invalid receiverId format" });
        }

        const user = await User.findById(senderId);
        if (!user) {
            return res.status(404).json({ message: "User Not Found", user: senderId });
        }

        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ],
        }).sort({ createdAt: 1 });

        if (messages.length === 0) {
            return res.status(404).json({ message: "No conversation found" });
        }

        res.status(200).json({ message: "Messages fetched successfully", messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = messageRouter;
