const Booking = require('../models/BookingModel');
const Event = require('../models/eventModel');


exports.createBooking = async (req, res) => {


  const { eventId, numberOfTickets } = req.body;
  try {
    if (!eventId || !numberOfTickets || numberOfTickets < 1) {
      return res.status(400).json({ message: 'Invalid event ID or number of tickets' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Event is not approved for booking' });
    }

    if (event.remainingTickets < numberOfTickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    event.remainingTickets -= numberOfTickets;
    await event.save();

    const totalPrice = numberOfTickets * event.ticketPricing;

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      numberOfTickets,
      status: 'confirmed',
    });
    await booking.save();

    res.status(201).json({ ...booking.toObject(), totalPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBooking = async (req, res) => {
  
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event', 'ticketPricing');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json({
      ...booking.toObject(),
      totalPrice: booking.numberOfTickets * booking.event.ticketPricing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
 
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (booking.status === 'canceled') {
      return res.status(400).json({ message: 'Booking already canceled' });
    }

    const event = await Event.findById(booking.event);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot cancel booking for an unapproved event' });
    }

    event.remainingTickets += booking.numberOfTickets;
    await event.save();

    booking.status = 'canceled';
    await booking.save();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};
