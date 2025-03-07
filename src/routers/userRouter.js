const express = require('express');
const User = require('../models/user.model');
const userAuth = require('../middlewares/userAuth.middleware');
const ConnectionRequest = require('../models/connectionRequest.model');

const userRouter = express.Router();
const USER_SAFE_DATA = ["firstName", "lastName", "gender", "age", "profileUrl", "skills", "about"];

userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const toUserId = req.user._id;
        const fromUserId = req.user._id;
        const status = "accepted";

        const connections = await ConnectionRequest.find({
            $or: [
                { toUserId: toUserId, status: status },
                { fromUserId: fromUserId, status: status }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)

        if (!connections || connections.length == 0) {
            throw new Error("No Connection Found");
        }

        const allConnetions = connections.map(conn => {
            if (conn.fromUserId.toString() === req.user._id.toString()) {
                return conn.toUserId;
            } else {
                return conn.fromUserId;
            }
        });

        res.status(200).json({ message: `${req.user.firstName}, You have ${allConnetions.length} Connections`, connections: allConnetions })

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
})

userRouter.get('/reviewReceivedRequest', userAuth, async (req, res) => {
    try {
        const toUserId = req.user._id;
        const status = 'interested';

        const allReceivedRequests = await ConnectionRequest.find({ toUserId: toUserId, status: status }).populate('fromUserId', USER_SAFE_DATA);;

        if (!allReceivedRequests || allReceivedRequests.length == 0) {
            throw new Error("No Connection Request Received");
        }

        res.status(200).json({ message: `${req.user.firstName}, You have Received ${allReceivedRequests.length} Connection Requests`, receivedRequests: allReceivedRequests })

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

userRouter.get('/reviewSentRequests', userAuth, async (req, res) => {
    try {

        const fromUserId = req.user._id;
        const status = 'interested';

        const allSentRequests = await ConnectionRequest.find(
            { fromUserId: fromUserId, status: status }
        ).populate('toUserId', USER_SAFE_DATA);

        if (!allSentRequests || allSentRequests.length == 0) {
            throw new Error("No Connection Requst Sent");
        }

        res.status(200).json({ message: `${req.user.firstName}, You have ${allSentRequests.length} sent Connection Requests`, sentRequests: allSentRequests })

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
});

userRouter.get('/feed', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user;

        const page = req.params.page;
        let limit = req.params.limit;
        limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsers = new Set();

        connectionRequests.forEach(req => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString())
        });

        const user = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsers) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).json({ message: `${loggedInUser.firstName}, You have ${user.length} users in Your Feed`, feed: user })

    } catch (error) {
        res.status(500).json({ message: 'Error', error: error.message });
    }
})

module.exports = userRouter;