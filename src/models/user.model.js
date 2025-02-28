const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true,
    },
    lastName: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: [true, "Email is Require"],
        unique: [true, "Email Should be unique"],
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        require: [, "Password is required"]
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "Other"],
            message: "{VALUE} is require"
        }
    },
    age: {
        type: Number,
    },
    about: {
        type: String,
        default: "This is the Default About Us"
    },
    profileUrl: {
        type: String,
        default: "https://cdn.vectorstock.com/i/2000v/51/87/student-avatar-user-profile-icon-vector-47025187.avif"
    },
    skills: {
        type: [String],
    }
}, { timestamps: true });

userSchema.index({ firstName: 1 });
userSchema.index({ lastName: 1 });

const User = new mongoose.model("User", userSchema);

module.exports = User