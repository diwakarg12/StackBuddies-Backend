const express = require('express');
const mongoose = require('mongoose');

const connectionRequest = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: "User",
    },
    toUserId: {
        type: mongoose.Schema.ObjectId,
        require: true,
        ref: "User"
    },
    status: {
        type: String,
        require: true,
        enum: {
            values: ["interested", "ignored", "accepted", "rejected"],
            message: "{VALUE} is Invalid"
        }
    }
}, { timestamps: true });

connectionRequest.index({ fromUserId: 1, toUserId: 1 });

connectionRequest.pre("save", function (next) {
    const request = this;

    if (request.fromUserId.toString() === request.toUserId.toString()) {
        throw new Error("Cannot send Connection Request to Yourself!!");
    }

    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequest);

module.exports = ConnectionRequest;