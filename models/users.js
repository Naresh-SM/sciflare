const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        default: 1
    },
    isVerified: {
        type: Number,
        default: 1
    }
}, {timestamps: true});

module.exports = mongoose.model('application_users', userSchema);