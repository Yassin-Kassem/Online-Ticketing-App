const mongoose = require('mongoose');

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
});
<<<<<<< HEAD

=======
>>>>>>> a30e411512d9e5be1a57ac358e74b6342929cf6d
module.exports = mongoose.model('Event', eventSchema);