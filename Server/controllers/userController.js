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

const forgotPassword = async (req, res, next) => {
    try {
        // Extract email and newPassword from request body
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ error: "Email and new Password are required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if new Password is the same as the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ error: "New password cannot be the same as the old password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password in the database
        user.password = hashedNewPassword;
        await user.save();

        // Return the updated user data (excluding password)
        const { password: userPassword, ...otherData } = user._doc;
        return res.status(200).json(otherData);
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
};

const getUserById = async (req, res, next) => { //admin access only
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            res.status(400);
            throw new Error("User not Found");
        }
        return res.status(200).json(message = user);
    } catch (error) {
        next(error)
    }
};

const updateUserRole = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Use 404 for "not found"
        }

        return res.status(200).json({ message: 'New Role: ' + user.role }); // Properly format the response
    } catch (error) {
        next(error);
    }
};

const deleteUser = async(req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            res.status(400);
            throw new Error("User not found");
        }
        return res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        next(error);
    }
}

  module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    LogoutUser,
    forgotPassword,
    getUserById,
    updateUserRole,
    deleteUser,
  }
