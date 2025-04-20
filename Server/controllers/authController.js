const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require("dotenv").config();



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
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = generateOTP();

        // Save OTP and expiration time in the database
        user.resetPasswordOTP = otp;
        user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
        await user.save();

        // Send OTP via email
        await sendOTPViaEmail(email, otp);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Function to generate a 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString(); // Generates a random 6-digit number
};

// Function to send OTP via email
const sendOTPViaEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

const verifyOTP = async(req, res, next) => {
    try {
        const { email, otp } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if OTP matches and has not expired
        if (user.resetPasswordOTP !== otp || Date.now() > user.resetPasswordExpires) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Mark OTP as verified
        user.resetPasswordOTP = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the new password is the same as the old password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ message: "New password cannot be the same as the old password" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }

}
module.exports = {
    registerUser,
    loginUser,
    LogoutUser,
    forgotPassword,
    generateOTP,
    sendOTPViaEmail,
    verifyOTP,
    resetPassword,
}