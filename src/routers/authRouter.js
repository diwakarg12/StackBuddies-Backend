const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { signupValidation, loginValidation } = require('../Utils/apiValidation');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        signupValidation(req.body);
        const { firstName, lastName, email, password, age, gender } = req.body;

        const existedUser = await User.findOne({ email: email });
        if (existedUser) {
            return res.status(400).json({ message: "User Already Existed, Please Login" })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordHash,
            age: age,
            gender: gender
        });

        await user.save();

        const token = jwt.sign({ _id: user._id }, "Diwakar@123", { expiresIn: '1d' })
        console.log('Token', token)
        if (!token) {
            throw new Error("Error while Generating Token");
        }

        res.cookie('token', token);

        res.status(200).json({ message: "User Created SuccessFully", user: user })
    } catch (error) {
        res.status(200).json({ message: "Error", error: error.message });
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        loginValidation(req.body)
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        const pass = await bcrypt.compare(password, user.password);
        if (!pass) {
            return res.status(404).json({ message: "Invalid Credentials" })
        }

        const token = jwt.sign({ _id: user._id }, "Diwakar@123", { expiresIn: '1d' })
        console.log('Token', token)
        if (!token) {
            throw new Error("Error while Generating Token");
        }

        // res.cookie('token', token);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
        });
        res.status(200).json({ message: "Login Successfull", user: user })

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
})

authRouter.post('/logout', async (req, res) => {
    const token = res.cookie('token', null, { expires: new Date(Date.now()) });
    res.status(200).json({ message: "user LoggedOut Successfully", user: null })
})

module.exports = authRouter;