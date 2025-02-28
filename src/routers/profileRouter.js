const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { updateValidation, updatePasswordValidation } = require('../Utils/apiValidation');

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

profileRouter.patch('/edit', userAuth, async (req, res) => {
    try {
        updateValidation(req.body)
        const currentUser = req.user;
        console.log(currentUser);
        Object.keys(req.body).forEach(key => currentUser[key] = req.body[key]);
        console.log(currentUser);

        await currentUser.save();

        res.status(200).json({ message: `${currentUser.firstName} Your profile is updated user Successfully`, user: currentUser })
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
})

profileRouter.patch('/change-password', userAuth, async (req, res) => {
    try {
        const currentUser = req.user;
        const { password } = req.body;
        updatePasswordValidation(password);

        const passwordHash = await bcrypt.hash(password, 10);

        currentUser.password = passwordHash;
        await currentUser.save();

        res.status(200).json({ message: `${currentUser.firstName}, Your Password has been changed successfully!` })

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
})

profileRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error("Invalid Email id, Please provide the Correnct email Id");
        }

        const toEmail = email;
        const emailSubject = `Password Reset Request`;
        const emailBody = `
            Dear ${firstName},

            We received a request to reset the password for your account. If you made this request, please click the link below to reset your password:

            [Reset Your Password](#)

            This link will expire in 1 hour. If you did not request a password reset, please ignore this email, and your password will remain unchanged.

            If you have any questions or need further assistance, feel free to contact our support team at diwakargiri23@gmail.com.

            Thank you for being a part of STACKBUDDIES.

            Best regards,  
            STACKBUDDIES Support Team
            [Company Website]
        `;



    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
})


module.exports = profileRouter;