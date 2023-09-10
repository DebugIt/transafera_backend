const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true,
    },
    token: {
        type: String,
    },
})

const Admin = mongoose.model("Admin", AdminSchema);
module.exports = Admin;