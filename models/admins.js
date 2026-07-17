const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    username: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false
    },
    phone: {
        type: String,
        trim: true,
        require: true
    }
}, {timestamps: true});

const model = mongoose.model("Admin", schema);
module.exports = model;