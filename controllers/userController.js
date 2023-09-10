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
    
    transfer: async ( amount, receiver, currentuser ) => {
        try {
            const findUser = await User.findOne({ username: currentuser })
            // check if user and available balance
            if(findUser && (findUser.balance >= amount)){
                const checkReceiver = await User.findOne({ username: receiver })
                if(checkReceiver){
                    
                    console.log(`Deducting ${amount} from ${currentuser}`);
                    const updateSenderBal = await User.findOneAndUpdate(
                    { username: currentuser },
                    { $inc: { balance: -amount } },
                    { new: true }
                    );
                    // console.log('Updated sender balance:', updateSenderBal.balance);

                    // Credit to receiver:
                    console.log(`Crediting ${amount} to ${receiver}`);
                    const updateReceiverBal = await User.findOneAndUpdate(
                    { username: receiver },
                    { $inc: { balance: amount } },
                    { new: true }
                    );
                    // console.log('Updated receiver balance:', updateReceiverBal.balance);
                    // 

                    if( updateSenderBal && updateReceiverBal ){
                        return {
                            success: true,
                            status: 201,
                            message: "Transfer success!",
                        }
                    }

                }else {
                    return {
                        success: false,
                        status: 404,
                        message: "No such receiver found"
                    }
                }

            }else if(findUser && (findUser.balance < amount)){
                return {
                    success: false,
                    status: 405,
                    message:"Insufficient Balance"
                }
            }
            else if(!findUser){
                console.log(amount, currentuser, receiver)
                return {
                    success: false,
                    status: 404,
                    message :"No such account exists!"
                }
            }
            else{
                return {
                    success: false,
                    status: 403,
                    message : 'Something went wrong',
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
            const user = await User.findOne({ username });
            if(user && (await bcrypt.compare(password, user.password))){
                const token = jwt.sign(
                    {id: user._id},
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "3d"
                    }
                )
                user.token = token
                const options = {
                    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                
                const cooki = ("token", token, options)
                return {
                    success: true,
                    status: 200,
                    message: "Logged in!",
                    user: user,
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
            const checkIfExists = await User.findOne({username: data?.username});
            if(checkIfExists){
                return {
                    success: false,
                    status: 401,
                    message:"Username already exists",
                    user:null
                }
            }else{
                // encrypt password
                let encPassword = await bcrypt.hash(data?.password, 10);
                let newUser = new User({
                    username: data?.username,
                    password: encPassword,
                })

                const token = jwt.sign(
                    { id: newUser._id, username: data?.username },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: "1h",
                    }
                );

                newUser.token = token
                const usr = await newUser.save();
                if(usr){
                    return {
                        success: true,
                        status: 201,
                        message: "User Registered!",
                        user: usr
                    }
                }else{
                    return {
                        status: 400,
                        success: false,
                        message: "Error in creating Admin",
                        student: null,
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                status: 500,
                message: "Error in creating student",
                user: null
            }
        }
    }
}