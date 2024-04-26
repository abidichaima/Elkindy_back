const Lesson = require("../models/lessonModel.js");
const Course = require('../models/courseModel.js');
const errorHandler = require("../utils/error.js");
const { default: mongoose } = require("mongoose");
const User = require("../models/user").User;


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
    const lessons = await Lesson.find()
      .populate('teacher', 'firstName lastName')
      .populate('course', 'name')
      .populate('classroom', 'name')
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

module.exports.deleteAlllessons = async (req, res, next) => {
  try {
    await Lesson.deleteMany();
    console.log("All lessons deleted");
    res.status(200).json("All lessons have been deleted!");
  } catch (error) {
    next(error);
  }
}

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

module.exports.getLessonByTeacher = async (req, res, next) => {
  try {
    const id = req.header('teacher');
    User.findById(id)
      .populate('lessons')
      .then(user => {
      //  console.log(user);
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


module.exports.getLessonByStudent = async (req, res, next) => {
  try {
    const id = req.header('student');
    User.findById(id)
      .populate('lessons')
      .then(user => {
      //  console.log(user);
        Lesson.find({students:user._id})
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



exports.getLessonsByCourseAndLevel = async (req, res) => {
  try {
    const { courseName, niveau } = req.query;

    // Find the course by name and niveau
    const course = await Course.findOne({ name: courseName, niveau });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Find lessons that reference the course ID
    const lessons = await Lesson.find({ course: course._id })
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
      .exec();

    res.status(200).json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};