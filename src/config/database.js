const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.connect(process.env.databaseURI)
}

module.exports = connectDB;