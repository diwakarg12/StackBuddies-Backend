const express = require('express');
const User = require('../models/user.model');
const userAuth = require('../middlewares/userAuth.middleware');

const userRouter = express.Router();


module.exports = userRouter;