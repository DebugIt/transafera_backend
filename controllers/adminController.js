const Admin = require("../models/Admin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
    getbal: async (username) => {
        try {
            const checkUser = await User.findOne({username});
            if(checkUser){
                return {
                    success: true,
                    status: 201,
                    message: "Details Fetched!",
                    balance: checkUser.balance
                }
            }else{
                return {
                    success: false,
                    status: 404,
                    message: "User not found!",
                    balance: null
                }
            }
        } catch (error) {
            return {
                success: false,
                status: 500,
                message: "Error in Fetching",
                balance: null
            }
        }
    }, 
    
    // TODO: to edit the working
    transfer: async ( amount, receiver ) => {
        try {
            const checkReceiver = await User.findOne({ username: receiver })
            if(checkReceiver){

                // Credit to receiver:
                console.log(`Crediting ${amount} to ${receiver}`);
                const updateReceiverBal = await User.findOneAndUpdate(
                    { username: receiver },
                    { $inc: { balance: amount } },
                    { new: true }
                );
                     

                if( updateReceiverBal ){
                    return {
                        success: true,
                        status: 201,
                        message: `Transfer success! to ${receiver}`,
                    }
                }

            }else {
                return {
                    success: false,
                    status: 404,
                    message: "No such receiver found"
                }
            }

        } catch (error) {
            return {
                success: false,
                status: 500,
                message: "Error in transfering",
                balance: null
            }
        }
    }, 
    
    login: async (username, password) => {
        try {
            const admin = await Admin.findOne({ username });
            if(admin && (await bcrypt.compare(password, admin.password))){
                const token = jwt.sign(
                    {id: admin._id},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "3d"
                    }
                )
                admin.token = token
                const options = {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                
                const cooki = ("token", token, options)
                return {
                    success: true,
                    status: 200,
                    message: "Logged in!",
                    admin: admin,
                    token: cooki
                }
            }
        } catch (error) {
            return {
                success: false,
                status: 500,
                message: "Internal Server Error"
            }
        }
    },
    
    signup: async (data) => {
        try {
            const checkIfExists = await Admin.findOne({username: data?.username});
            if(checkIfExists){
                return {
                    success: false,
                    status: 401,
                    message:"Admin already exists",
                    user:null
                }
            }else{
                // encrypt password
                let encPassword = await bcrypt.hash(data?.password, 10);
                let newadmin = new Admin({
                    username: data?.username,
                    password: encPassword,
                })

                const token = jwt.sign(
                    { id: newadmin._id, username: data?.username },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );

                newadmin.token = token
                const admn = await newadmin.save();
                if(admn){
                    return {
                        success: true,
                        status: 201,
                        message: "Admin Registered!",
                        message: "Admin Registered!",
                        admin: admn
                    }
                }else{
                    return {
                        status: 400,
                        success: false,
                        message: "Error in creating Admin",
                        admin: null,
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                status: 500,
                message: "Error in creating Admin",
                admin: null
            }
        }
    }
}