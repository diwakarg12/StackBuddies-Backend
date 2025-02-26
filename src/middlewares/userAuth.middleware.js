const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const userAuth = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            throw new Error("No token Found, Please Login again");
        }

        const decodedData = jwt.verify(token, "Diwakar@123");
        const _id = decodedData._id

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("NO User Found");
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message })
    }
}