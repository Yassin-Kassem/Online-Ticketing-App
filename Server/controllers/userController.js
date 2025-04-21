const User = require('../models/UserModel');
const Booking = require('../models/BookingModel');
const Event = require('../models/EventModel');
const validator = require('validator');
require('dotenv').config()

const getProfile = async (req, res, next) => {
    try {
      // Extract the user ID from the authenticated user (available via req.user)
      const userId = req.user.id;
  
      // Find the user by ID and exclude sensitive fields like password
      const user = await User.findById(userId).select('-password');
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Return the user profile
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
  // Update current user's profile
const UpdateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user's ID
        const { name, email, profilePicture, password } = req.body;
        
    if (email && !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

        // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Validate email uniqueness if provided
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: 'Email is already in use' });
        }
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      user.profilePicture = profilePicture || user.profilePicture;
     
      
      const updatedUser = await user.save();
  
      res.status(200).json({
       
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


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

const getUserBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const bookings = await Booking.find({ user: userId });
        if(!bookings) {
            return res.status(404).json({ message: 'No bookings found for this user' });
        }
        return res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
}

const getUserEvents = async (req, res, next) => {
    try {
        const userId = req.user.id;
        if(!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const events = await Event.find({ organizer: userId });
        if(!events) {
            return res.status(404).json({ message: 'No events found for this organizer' });
        }
        return res.status(200).json(message = events);
    } catch (error) {
        next(error);
    }
}

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

const userEventAnalytics = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const events = await Event.find({ organizer: userId });
        
        if (!events || events.length === 0) {
            return res.status(404).json({ message: 'No events found for this user' });
        }

        const eventsWithAnalytics = events.map(event => {
            const ticketsBooked = event.totalTicketsAvailable - event.remainingTickets;
            const bookingPercentage = (ticketsBooked / event.totalTicketsAvailable) * 100;
            
            return {
                ...event.toObject(),
                ticketsBooked,
                bookingPercentage: Math.round(bookingPercentage * 100) / 100 + "%" // Round to 2 decimal places
            };
        });

        return res.status(200).json(eventsWithAnalytics);
    } catch (error) {
        next(error);
    }
};


  module.exports = {
    getProfile,
    UpdateProfile,
    getAllUsers,
    getUserById,
    updateUserRole,
    deleteUser,
    getUserBookings,
    getUserEvents,
    userEventAnalytics,
  }
