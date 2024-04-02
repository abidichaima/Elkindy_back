const mongoose = require('mongoose');


// Define the holiday schema
const holidaySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    }
});

// Export the model
module.exports = mongoose.model('Holiday', holidaySchema);