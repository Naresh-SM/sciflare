const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    organization_name: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true        
    },
    date: {
        type: Date,
        required: true,
    },
    ceo_name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true,
        default: 'admin'
    }
}, {timestamps: true});

module.exports = mongoose.model('organization', organizationSchema);