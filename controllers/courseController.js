const Course = require("../models/courseModel");
const errorHandler = require("../utils/error.js");

module.exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

module.exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};


module.exports.updateCourse = async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(errorHandler(404, "course not found"));
  }
  
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};
module.exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(errorHandler(404, "Course not found!"));
    }
    res.status(200).json(course);
  } catch (error) {
    next(error);
  }
};
module.exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(errorHandler(404, "Course not found!"));
    }
    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json("Your course has been deleted!");
  } catch (error) {
    next(error);
  }
};
