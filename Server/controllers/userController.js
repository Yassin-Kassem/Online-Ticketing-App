const { get } = require('mongoose');
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()


const getAllUsers = async(req, res, next) =>{
    try {
        const users = await User.find();
        if(!users){
            res.status(400);
            throw new error("No available Users")
        }
        return res.status(200).json(users); 
    } catch (error) {
        next(error);
    }
}

const registerUser = async(req, res, next) =>{
    try {
        const {password, ...rest} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // check if user already exists
        const userExists = await User.findOne({email: req.body.email});
        if(userExists){
            res.status(400);
            throw new Error("User already exists");
        }
        const user = await User.create({
            ...rest,
            password: hashedPassword,
        });
        if(!user){
            res.status(400);
            throw new Error("User not Created");
        }

        // hash password before saving to db
        const { password : userPassword, ...otherData} = user._doc;
        return res.status(201).json(otherData);

    } catch (error) {
        next(error);
    }
}

const loginUser = async(req, res, next) =>{
    try {
        const { email, password } = req.body;
        // get user from db
        const user = await User.findOne({email});
        if(!user){
            res.status(400);
            throw new Error("user not found");
        }
        //compare password
        const hashedPassword = await bcrypt.hash(password, 10);

        const isCorrect = await bcrypt.compare(password, user.password);
        console.log("Password Match Result:", isCorrect);
        if(!isCorrect){
            res.status(400);
            throw new Error("Invalid password");
        }
        //generate token
        //set cookie
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.cookie("jwt", token);

        const { password: userPassword, ...rest } = user._doc;
        return res.status(200).json({
            message: "Login successful",
            ...rest,
        });
    } catch (error) {
        next(error);
    }

}

const LogoutUser = async(req, res, next) => {
    res.cookie("jwt", "", {expiresIn: "-1"});
    return res.json({message: "youve been logged out successfully"});
}


  module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    LogoutUser,
  }
