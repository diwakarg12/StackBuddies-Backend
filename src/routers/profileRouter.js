const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const User = require('../models/user.model');

const profileRouter = express.Router();

profileRouter.get('/view', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        if (!loggedInUser) {
            throw new Error("Unable to Get user Data");
        }

        res.status(200).json({ message: "User Data Fetched", user: loggedInUser })
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

profileRouter.post('/edit', userAuth, async(req, res) => {
     
})


module.exports = profileRouter;