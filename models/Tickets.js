const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tickets = new Schema(
    {
        event_id: {
            type: String,
            required: true,
        },
        user_id: {
            type: String, // Add the 'type' property here
            required: true,
        },
        number: {
            type: Number,
        },
        amount: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("tickets", Tickets);