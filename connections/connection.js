const mongoose = require("mongoose");
const dotenv = require("dotenv").config()

mongoose.connect(process.env.MONGOURI).then(
    () => {
        console.log('Connection to DB success!')
    }
).catch(
    err => {
        console.error(`Error connecting: ${err}`);
    }
)