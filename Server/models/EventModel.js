const mongoose = require('mongoose');
const { Schema } = mongoose;


const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  ticketPricing: { type: Number, required: true },
  totalTicketsAvailable: { type: Number, required: true },
  remainingTickets: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["approved", "pending", "declined"],
    default: 'pending',
  },
});

module.exports = mongoose.model('Event', eventSchema);