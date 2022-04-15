const {response} = require('express');
const EventsModels = require('../models/Events-models');



const getEvent = async(req, res = response) =>{

    const events = await EventsModels.find()
                                     .populate('user', 'name');

    res.status(201).json({
        ok: true,
        events
    })
}

const createEvent = async (req, res = response) =>{

    const event = new EventsModels( req.body);

    try {
        
        event.user = req.uid;

        const eventDb = await event.save();

        res.status(201).json({
            ok: true,
            event: eventDb
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: 'false',
            msg: 'Please contact the admin...'
        })
    }
}

const refreshEvent = async(req, res = response) =>{

    const eventID = req.params.id;
    const uid = req.uid

    try {
        
        const event = await EventsModels.findById( eventID );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'This event does not exist'
            });
        } 

        if ( event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false, 
                msg: 'You are not allowed to edit this event'
            })
        }

        const newEvent ={
            ...req.body,
            user: uid
        }

        const refreshedEvent = await EventsModels.findByIdAndUpdate( eventID, newEvent, {new: true})

        res.status(201).json({
            ok: true,
            event: refreshedEvent
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the admin'
        })
    }
}

const deleteEvent = async(req, res = response) =>{

    const eventID = req.params.id;
    const uid = req.uid

    try {
        
        const event = await EventsModels.findById( eventID );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'This event does not exist'
            });
        } 

        if ( event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false, 
                msg: 'You are not allowed to delete this event'
            })
        }
        
        
        await EventsModels.findByIdAndDelete(eventID)

        res.status(201).json( { ok: true } );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Please contact the admin'
        })
    }
}

module.exports = {
    getEvent, 
    createEvent,
    refreshEvent,
    deleteEvent
}