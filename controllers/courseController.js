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

// Associate a user with a course
exports.enrollUserInCourse = async (req, res) => {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    // Find the user and course documents
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'User or course not found' });
    }

    // Check if the user is already enrolled in the course
    if (user.courses.includes(courseId)) {
      return res.status(400).json({ message: 'User is already enrolled in this course' });
    }

    // Associate the user with the course
    user.courses.push(courseId);
    await user.save();

    res.status(200).json({ message: 'User enrolled in the course successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


//////////////////////////
