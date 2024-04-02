

const FreeTime = require("../models/freeTimeModel.js");
const errorHandler = require("../utils/error.js");
const User = require("../models/authModel");

module.exports.createFreeTime = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    const freeTimes = req.body; // Assuming req.body is an array of free time slot objects
    
    // Iterate over each free time slot object in the array
    for (const freeTimeData of freeTimes) {
      const freeTime = new FreeTime(freeTimeData);
      user.freeTime.push(freeTime);
      await freeTime.save(); // Save each freeTime object
    }
    await user.save();
    res.status(201).json({ success: true, message: 'Free time slots created successfully' });
  } catch (error) {
    next(error);
  }
};
module.exports.updateFreeTime = async (req, res, next) => {
  try {
    const freeTime = await FreeTime.findById(req.params.freeTimeId);
    if (!freeTime) {
      return next(errorHandler(404, "Free time slot not found"));
    }
    Object.assign(freeTime, req.body);
    await freeTime.save();
    res.status(200).json(freeTime);
    
  } catch (error) {
    next(error);
  }
};

module.exports.getFreeTime = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate('freeTime');
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    console.log('All free times retrieved');
    res.status(200).json(user.freeTime);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteFreeTime = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    const freeTimeId = req.params.freeTimeId;
    user.freeTime.pull(freeTimeId);
    await user.save();
    await FreeTime.findByIdAndDelete(freeTimeId);
    res.status(200).json({ message: 'Free time slot deleted' });
  } catch (error) {
    next(error);
  }
};
module.exports.deleteAllFreeTimes = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, "User not found"));
    }
    user.freeTime = []; // Remove all free time slots
    await user.save();
    await FreeTime.deleteMany({ _id: { $in: user.freeTime } }); // Delete all related freeTime documents
    res.status(200).json({ message: 'All free time slots deleted' });
  } catch (error) {
    next(error);
  }
};
