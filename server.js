// transfera
const express = require("express");
const app = express()
const cors = require("cors");
const PORT = 4000 || process.env.PORT

app.use(cors())
app.use(express.json())

// DB connection

// import routes

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