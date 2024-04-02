const Tickets = require('../models/Tickets')
const express = require('express');
const router = express.Router();
module.exports = router;
const axios = require('axios');



router.get('/getTickets', async (req, res, next) => {
    try {
      const tickets = await Tickets.find({});
      res.send(tickets);
    } catch (err) {
      console.log(err);
    }
  });
  

  // GET BY id 

router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const ticket = await Tickets.findOne({ _id: id });
  
      if (!ticket) {
        res.status(404).send("Ticket not found");
        return;
      }
  
      res.status(200).json({
        success: true,
        ticket
      })
    } catch (error) {
      console.log(error);
      next(error);
  
    }
  });

  //get by event id

  router.get('/event/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const tickets = await Tickets.find({ event_id: id });
  
      if (!tickets || tickets.length === 0) {
        res.status(404).send("No tickets found for the specified event");
        return;
      }
  
      res.status(200).json({
        success: true,
        tickets
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


  //get by user id 
  router.get('/user/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      const tickets = await Tickets.find({ user_id: id });
  
      if (!tickets || tickets.length === 0) {
        res.status(404).send("No tickets found for the specified event");
        return;
      }
  
      res.status(200).json({
        success: true,
        tickets
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  
  //ADD

  router.post('/addTicket', async (req, res, next) => {
    try {
      console.log('Request Body:', req.body); // Check the received data
      const newTickets = new Tickets(req.body);
      const savedTickets = await newTickets.save();
      console.log("Ticket saved:", savedTickets);
      res.status(201).json({
        success: true,
        savedTickets
      })
    } catch (error) {
      console.log(error);
      next(error);
  
    }
  });


  //ADD and Update event
  router.post('/addUpdate', async (req, res, next) => {
    try {
      console.log('Request Body:', req.body); // Check the received data
      const newTicket = new Tickets(req.body);
      
      // Attempt to save the ticket
      const savedTicket = await newTicket.save();
  
      if (savedTicket) {
        const eventId = savedTicket.event_id;
        const eventResponse = await axios.get(`http://localhost:4000/events/${eventId}`);
        const event = eventResponse.data.event;
  
        event.tickets = event.tickets + savedTicket.number;
  
        // Use a PUT request to update the event
        const updatedEventResponse = await axios.put(`http://localhost:4000/events/updateTickets/${eventId}`, {
          tickets: event.tickets,
        });
        console.log("Ticket saved:", savedTicket);
        console.log("Event updated:", updatedEventResponse.data);
      } else {
        // Ticket failed to save
        res.status(500).json({
          success: false,
          message: "Failed to save the ticket."
        });
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });