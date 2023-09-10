// transfera
const express = require("express");
const app = express()
const cors = require("cors");
const dotenv = require("dotenv").config()

const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// DB connection
require("./connections/connection");

// import routes
const userRoute = require("./routes/user");



// use routes
app.use("/api/user", userRoute);


// base route
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Server running!"
    })
})


// listening
app.listen(PORT, () => {
    console.log("Server up and running!")
})