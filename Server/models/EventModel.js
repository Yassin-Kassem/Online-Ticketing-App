const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: 'default-event-image.jpg', // Default image if not provided
    },
    ticketPricing: {
      type: Number,
      required: true,
      min: 0,
    },
    totalTickets: {
      type: Number,
      required: true,
      min: 0,
    },
    remainingTickets: {
      type: Number,
      required: true,
      min: 0,
      default: function () {
        return this.totalTickets; // Initialize remaining tickets to total tickets
      },
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the Organizer (User with role 'Organizer')
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);