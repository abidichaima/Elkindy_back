const mongoose = require('mongoose');
var Schema = mongoose.Schema
const Event = new Schema(
  {
    title: {
      type: String,
    },
    price: {
      type: Number,
    },
    maxPeople: {
      type: Number,
    },
    desc: {
      type: String,
    },
    date: {
      type: Date,
    },
    location: {
      type: String,
    },
    organizer: {
      type: String,
    },
    tickets: {
      type: Number,
      default: 0,
    },
    image: {
      public_id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }

    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("events", Event);