const Event = require('../models/EventModel');
const User = require('../models/UserModel');

const getAllEvents = async(req, res, next) =>{
    try {
        const events = await Event.find();
        if(events.length == 0){
            res.status(400);
            throw new Error("No available events")
        }
        return res.status(200).json(events); 
    } catch (error) {
        next(error);
    }
}

const getApprovedEvents = async(req, res, next) => {
    try {
        const events = await Event.find({status: "approved"});
        if(events.length == 0){
            res.status(400);
            throw new Error("No available approved events")
        }
    } catch (error) {
        next(error);
    }
}

const createEvent = async(req, res, next) =>{
    try {
        const userId = req.user.id;
        if(!userId) {
            res.status(401);
            throw new Error("User not found");
        }
        const {
            title,
            description,
            date,
            location,
            category,
            ticketPricing,
            totalTicketsAvailable,
            remainingTickets,
            organizer,
        }= req.body;
        const event = await Event.create({
            title,
            description,
            date,
            location,
            category,
            ticketPricing,
            totalTicketsAvailable,
            remainingTickets,
            organizer: userId,
        });
        if(!event){
            res.status(400);
            throw new Error("event not Created");
        }
        return res.status(200).json(event);
    } catch (error) {
        next(error);
        
    }
}
const getDetailsOfEvent = async(req, res, next) =>{
    try {
        const event = await Event.findById(req.params.id);
        if(!event){
            res.status(400);
            throw new Error("event not found");
        }
        const{organizer, ...rest}=event._doc;
        const orgName = await User.findById(organizer).name
        return res.status(200).json({orgName, ...rest});
    }
    catch (error) {
        next(error);
    }
}
const updateEvent = async (req, res, next) => {
    try {

      const updateData = {
        date: req.body.date,
        location: req.body.location,
        totalTicketsAvailable: req.body.totalTicketsAvailable,
      };


      const event = await Event.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.status(200).json(event);
    } catch (error) {
      next(error);
    }
  };
const deleteEvent = async(req, res, next) =>{
        try {
            const event = await Event.findByIdAndDelete(req.params.id);
            if(!event){
                res.status(400);
                throw new Error("event not found");
            }
            return res.status(200).json({message: "event deleted successfully"});
        } catch (error) {
            next(error);
        }
}
 
module.exports = {
    getAllEvents,
    createEvent,
    deleteEvent,
    getDetailsOfEvent,
    updateEvent,
    getApprovedEvents,
}
