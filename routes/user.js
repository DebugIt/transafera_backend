const express = require("express");
const userRouter = express.Router();
const { getbal, transfer, login, signup } = require("../controllers/userController");
const isUser = require("../middleware/isUser");
// middleware

// // routes
userRouter.get("/getbalance/:username", isUser ,async (req, res) => {
    try {
        const response = await getbal(req.params.username);
        const { success, status, balance, message } = response;
        if(status === 201){
            return res.status(status).json({
                success,
                status,
                message,
                balance
            })
        }else{
            return res.status(status).json({
                success,
                status,
                message
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        })
    }
})

// transfer
userRouter.put("/transfer", isUser ,async (req, res) => {
    try {
        // reciever
        const { amount, receiver, currentuser } = req.body
        const response = await transfer(amount, receiver, currentuser);
        const { success, status, balance, message } = response;
        if(status === 201){
            return res.status(status).json({
                success,
                status,
                message,
                balance
            })
        }else{
            return res.status(status).json({
                success,
                status,
                message
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        })
    }
})

// signup
userRouter.post("/signup", async (req, res) => {
    try {
        const response = await signup(req.body);
        const { status, success, message, user } = response;
        if(status === 201){
            return res.status(status).json({
                success,
                status,
                message,
                user
            })
        }else if(status === 400){
            return res.status(status).json({
                success,
                status,
                message,
                user
            })
        }else{
            return res.status(status).json({
                success,
                status,
                message, 
                user
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        })
    }
})

// login
userRouter.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body
        const response = await login(username, password);
        const { success, status, user, message, token } = response;
        if(status === 200){
            return res.status(status).json({
                success,
                status,
                message,
                token,
                user
            })
        }else if(status === 401){
            return res.status(status).json({
                success,
                status,
                message,
                user
            })
        }else{
            return res.status(status).json({
                success,
                status,
                message, 
                user
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error",
        })
    }
})

module.exports = userRouter