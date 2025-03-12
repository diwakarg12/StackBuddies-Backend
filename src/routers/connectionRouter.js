const express = require('express');
const User = require('../models/user.model');
const userAuth = require('../middlewares/userAuth.middleware');
const ConnectionRequest = require('../models/connectionRequest.model');
const { getConnectedUsers, getIO } = require('../socket/socket.server');

const connectionRouter = express.Router();

connectionRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested", "ignored"].includes(status);
        if (!allowedStatus) {
            throw new Error("Invalid Status", status);
        }

        if (fromUserId.toString() === toUserId.toString()) {
            throw new Error("You cannot send Connection Request ot Yourself!");
        }

        const user = await User.findById(toUserId);
        if (!user) {
            throw new Error("Invalid toUserId");
        }

        const existingConnection = await ConnectionRequest.findOne({
            $or: [
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingConnection) {
            throw new Error("Connection Already Existed");
        }

        const newConnection = await new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        });

        await newConnection.save();

        res.status(200).json({ message: "Connection Created Successfully", connectionRequest: newConnection })

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

connectionRouter.post('/review/:status/:fromUserId', userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const toUserId = req.user._id;
        const fromUserId = req.params.fromUserId;
        const status = req.params.status;

        const allowedStatus = ["accepted", "rejected"].includes(status);
        if (!allowedStatus) {
            throw new Error("Invalid Status", status);
        }

        const fromUser = await User.findById(fromUserId);
        if (!fromUser) {
            throw new Error('Connection is not Valid as the Sender is not Present in the Database')
        }

        const reviewRequest = await ConnectionRequest.findOne({
            fromUserId: fromUserId,
            toUserId: toUserId,
        });

        if (!reviewRequest) {
            throw new Error("No Connection Request Found!");
        }

        if (!reviewRequest.status === 'interested') {
            throw new Error("Invalid Connection Request");
        }

        reviewRequest.status = status;
        await reviewRequest.save();

        res.status(200).json({ message: `${req.user.firstName}, You have ${status} the Request!`, reviewRequest: reviewRequest })

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

module.exports = connectionRouter;