const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const User = require('../models/user.model');

const profileRouter = express.Router();


module.exports = profileRouter;