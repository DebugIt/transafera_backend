const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    balance: {
        type: Number,
        default: 0,
    }
})

const User = mongoose.model("User", UserSchema);
module.exports = User;