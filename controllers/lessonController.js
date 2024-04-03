const Lesson = require("../models/lessonModel.js");
const errorHandler = require("../utils/error.js");
const User = require("../models/user.js");
const { default: mongoose } = require("mongoose");



module.exports.createLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.create(req.body);
    console.log("Lesson created");
    return res.status(201).json(lesson);
  } catch (error) {
    next(error);
    console.log("Lesson not created");

  }
};

    

module.exports.updateLesson = async (req, res, next) => {
  const lesson = await Lesson.findById(req.params.id);
  if (!lesson) {
    return next(errorHandler(404, "lesson not found"));
  }
  
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log("Lesson updated");
    res.status(200).json(updatedLesson);
  } catch (error) {
    next(error);
  }
};

module.exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(errorHandler(404, "Lesson not found!"));
    }
    console.log("Lesson retrieved");
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

module.exports.getAllLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find().populate('teacher', 'firstName lastName').populate('course', 'name');
    console.log("All lessons retrieved");
    res.status(200).json(lessons);
  } catch (error) {
    next(error);
  }
};


module.exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(errorHandler(404, "Lesson not found!"));
    }
    await Lesson.findByIdAndDelete(req.params.id);
    console.log("Lesson deleted");
    res.status(200).json("Your lesson has been deleted!");
  } catch (error) {
    next(error);
  }
};

module.exports.getLessonById = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return next(errorHandler(404, "Lesson not found!"));
    }
    console.log("Lesson retrieved by ID");
    res.status(200).json(lesson);
  } catch (error) {
    next(error);
  }
};

module.exports.getLessonByTeacherName = async (req, res, next) => {
  try {
    const id = req.header('teacher');
    User.findById(id)
      .populate('lessons')
      .then(user => {
        console.log(user);
        Lesson.find({teacher:user._id})
          .populate({
            path: 'students',
            select: 'firstName lastName -_id'
          })
          .populate({
            path: 'teacher',
            select: 'firstName lastName -_id'
          })
          .populate({
            path: 'course',
            select: 'name -_id'
          })
          .then(lessons => {
            console.log(lessons);
            res.status(200).json(lessons);
          })
          .catch(error => {
            console.log(error);
            res.status(400).json({ message: "Bad request" });
          });
      })
      .catch(error => {
        console.log(error);
        res.status(400).json({ message: "Bad request" });
      });
  } catch(err) {
    next(err);
  }
};