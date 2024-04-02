const errorHandler = require("../utils/error.js");
const Holiday = require('../models/holidaysModel.js');

// Create a new holiday
module.exports.createHoliday = async (req, res) => {
    try {
    const { date } = req.body;
    
    // Create a new holiday instance
    const holiday = new Holiday({ date });
    
    // Save the holiday to the database
    await holiday.save();
    console.log('Holiday created successfully',holiday);
    res.status(201).json({ success: true, data: holiday });
    } catch (err) {
    res.status(400).json({ success: false, error: err.message });
    }
};

// Get all holidays
module.exports.getHolidays = async (req, res) => {
    try {
    const holidays = await Holiday.find();
    
    res.status(200).json(  holidays );
    console.log('All holidays retrieved');
    } catch (err) {
    res.status(400).json({  error: err.message });
    console.log('failed to retrieve holidays');

    }
};




// Update a holiday by id
module.exports.updateHolidays = async (req, res) => {
    try {
    const { date } = req.body;
    
    const holiday = await Holiday.findById(req.params.holidaysId);
    
    if (!holiday) {
        throw new errorHandler(`Holiday with id of ${req.params.holidaysId} not found`, 404);
    }
    
    holiday.date = date;
    
    await holiday.save();
    
    res.status(200).json({ success: true, data: holiday });
    } catch (err) {
    res.status(400).json({ success: false, error: err.message });
    }
};

// Delete a holiday by id
module.exports.deleteHolidays = async (req, res) => {
    try {
    const holiday = await Holiday.findById(req.params.holidaysId);
    
    if (!holiday) {
        throw new errorHandler(`Holiday with id of ${req.params.holidaysId} not found`, 404);
    }
    
    await holiday.remove();
    
    res.status(200).json({ data: {} });
    } catch (err) {
    res.status(400).json({ error: err.message });
    }
};

// Delete all holidays
module.exports.deleteAllHolidayss = async ( res) => {
    try {
    await Holiday.deleteMany();
    
    res.status(200).json({  data: {} });
    } catch (err) {
    res.status(400).json({  error: err.message });
    }
};
