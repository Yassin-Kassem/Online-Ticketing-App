const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: 'default-profile-picture.png', 
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ['Standard User', 'Organizer', 'System Admin'],
      default: 'Standard User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resetPasswordOTP: { 
      type: String 
    }, 
    resetPasswordExpires: { 
      type: Date 
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);