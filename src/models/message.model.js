const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;