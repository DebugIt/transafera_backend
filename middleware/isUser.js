const jwt = require("jsonwebtoken");
const User = require("../models/User")

const isUser = async (req, res, next) => {
    try {
        const token = req.headers["token"] || req.cookies.Token;
        if(!token){
            return res.status(403).json({
                status: 403,
                success: false,
                message: "PLease Login to continue"
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                status: 404,
                success: false,
                message: "User not found"
            })
        }else{
            next();
        }
        
    } catch (error) {
        console.error("Error:", error);
        return res.status(401).json({
            status: 401,
            success: false,
            message: "Invalid Token"
        });
    }
}

module.exports = isUser;
