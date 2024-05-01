const Classroom = require("../models/classroomModel.js");
const errorHandler = require("../utils/error.js");


module.exports.createClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.create(req.body);
    return res.status(201).json(classroom);
  } catch (error) {
    next(error);
  }
};

module.exports.getAllClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find();
    res.status(200).json(classrooms);
  } catch (error) {
    next(error);
  }
};


module.exports.updateClassroom = async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);
  if (!classroom) {
    return next(errorHandler(404, "classroom not found"));
  }
  
  try {
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedClassroom);
  } catch (error) {
    next(error);
  }
};
module.exports.getClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return next(errorHandler(404, "Classroom not found!"));
    }
    res.status(200).json(classroom);
  } catch (error) {
    next(error);
  }
};
module.exports.deleteClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return next(errorHandler(404, "Classroom not found!"));
    }
    await Classroom.findByIdAndDelete(req.params.id);
    res.status(200).json("Your classroom has been deleted!");
  } catch (error) {
    next(error);
  }
};
