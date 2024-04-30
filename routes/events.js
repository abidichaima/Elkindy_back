const Event = require('../models/event')
const express = require('express');
const router = express.Router();
module.exports = router;
const cloudinary = require('../utils/cloudinary');
const ErrorResponse = require('../utils/errorResponse');
const { spawn } = require('child_process');
const path = require('path');
const Comment = require("../models/CommentModel");
const CommentModel = require('../models/CommentModel');


// GET  

router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find({});
    res.send(events);
  } catch (err) {
    console.log(err);
  }
});


// GET BY id 

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const event = await Event.findOne({ _id: id });

    if (!event) {
      res.status(404).send("Event not found");
      return;
    }

    res.status(200).json({
      success: true,
      event
    })
  } catch (error) {
    console.log(error);
    next(error);

  }
});

// ADD 

router.post('/add', async (req, res, next) => {
  try {
    console.log('Request Body:', req.body); // Check the received data
    const newEvent = new Event(req.body);
    const savedEvent = await newEvent.save();
    console.log("Event saved:", savedEvent);
    res.status(201).json({
      success: true,
      savedEvent
    })
  } catch (error) {
    console.log(error);
    next(error);

  }
});

//add with image 

router.post('/addImage', async (req, res, next) => {
  try {
    const {
      title, price, maxPeople, desc, date, location, organizer, tickets, image
    } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      folder: "products",
      // width: 300,
      // crop: "scale"
    })
    console.log('Request Body:', req.body); // Check the received data

    const event = await Event.create({
      title,
      price,
      maxPeople,
      desc,
      date,
      location,
      organizer,
      tickets,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      }

    });

    res.status(201).json({
      success: true,
      event
    })
  } catch (error) {
    console.log(error);
    next(error);

  }
});
//test update image 



router.post("/updateImage", async function (req, res, next) {
  try {
    var id = req.body.id;

    const event = await Event.findOne({ _id: id });
    const eventold = await Event.findOne({ _id: id });

    if (!event) {
      console.log("id : ", id)
      res.status(404).send("Event not found");
      return;
    }


    event.title = req.body.title;
    event.price = req.body.price;
    event.maxPeople = req.body.maxPeople;
    event.desc = req.body.desc;
    event.date = req.body.date;
    event.location = req.body.location;
    event.organizer = req.body.organizer;
    event.tickets = req.body.tickets;
    event.image = req.body.first_image;

    if (req.body.image !== null) {
      const ImgId = event.image.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "products",
        // width: 300,
        // crop: "scale"
      })
      event.image = {
        public_id: result.public_id,
        url: result.secure_url
      }
    }
    await event.save();
    res.status(201).json({
      success: true,
      event
    })
  } catch (error) {
    console.log(error);
    next(error);

  }
});


// UPDATE 

router.post("/update", async function (req, res, next) {
  try {
    var id = req.body._id;

    const event = await Event.findOne({ _id: id });

    if (!event) {
      res.status(404).send("Event not found");
      return;
    }

    for (const key in req.body) {
      if (req.body.hasOwnProperty(key) && event[key] !== undefined) {
        event[key] = req.body[key];
      }
    }

    await event.save();
    res.status(201).json({
      success: true,
      event
    })
  } catch (error) {
    console.log(error);
    next(error);

  }
});


// DELETE 
/*
router.delete("/delete/:id", async function (req, res, next) {
  var id = req.params.id; // Use req.params to get the title from the route parameter

  try {
    const e = await Event.findById(req.params.id);
    const imgId = e.image.public_id;
    if (imgId) {
        await cloudinary.uploader.destroy(imgId);
    }
    const rm = await Event.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      id
    })
  } catch (error) {
    console.log(error);
    next(error);

  }
});*/

router.delete("/delete/:id", async function (req, res, next) {
  var id = req.params.id;
  try {
    const commentsToDelete = await Comment.find({ event_id: id });
    await Comment.deleteMany({ event_id: id });
    const e = await Event.findById(req.params.id);
    const imgId = e.image.public_id;
    if (imgId) {
      await cloudinary.uploader.destroy(imgId);
    }
    const rm = await Event.findByIdAndDelete({ _id: id });

    res.status(200).json({
      commentsToDelete,
      success: true,
      id
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});


//update only tickets 
router.put("/updateTickets/:id", async function (req, res, next) {
  try {
    const eventId = req.params.id;
    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    // Update tickets property
    event.tickets = req.body.tickets;

    // Save the updated event
    await event.save();

    res.status(200).json({ success: true, message: "Event tickets updated successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});


router.post('/analyze', (req, res) => {
  const pythonProcess = spawn('python', [path.join(__dirname, 'python_scripts', 'main.py')]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ success: true, message: 'Analysis completed successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Analysis failed' });
    }
  });
});


router.get('/ma/stat', async (req, res) => {
  try {
    const events = await Event.find({}); // Get all events

    const eventStats = [];
    for (const event of events) {
      const comments = await CommentModel.find({ event_id: event._id });

      let totalComments = 0;
      let goodComments = 0;
      let badComments = 0;
      let neutralComments = 0;

      for (const comment of comments) {
        totalComments++;
        if (comment.satisfaction > 0.5) {
          goodComments++;
        } else if (comment.satisfaction < 0) {
          badComments++;
        } else {
          neutralComments++;
        }
        if (comment.replies && comment.replies.length > 0) {
          for (const reply of comment.replies) {
            totalComments++;
            if (reply.satisfaction > 0.5) {
              goodComments++;
            } else if (reply.satisfaction < 0) {
              badComments++;
            } else {
              neutralComments++;
            }

          }
        }

      }

      eventStats.push({
        eventName: event.title,
        totalComments,
        goodComments,
        badComments,
        neutralComments
      });
    }

    res.json(eventStats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


