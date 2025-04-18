const User = require('../models/UserModel');
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
    getUserById,
    updateUserRole,
    deleteUser,
  }
