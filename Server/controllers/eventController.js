const Event = require('../models/eventModel');
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
}
