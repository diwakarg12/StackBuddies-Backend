const express = require('express');
const userAuth = require('../middlewares/userAuth.middleware');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authRouter = express.Router();

module.exports = authRouter;