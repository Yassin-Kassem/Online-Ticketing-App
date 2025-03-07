const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who made the booking
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event', // Reference to the event being booked
      required: true,
    },
    numberOfTickets: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);