const express = require("express");
const { createLesson, updateLesson, getLesson, deleteLesson ,getAllLessons,getLessonByTeacher,deleteAlllessons} = require("../controllers/lessonController");


const router = express.Router();

router.post('/create', createLesson);
router.delete('/delete/:id', deleteLesson);
router.put('/update/:id', updateLesson)
router.get('/get/:id',getLesson)
router.get('/get', getAllLessons)
router.get('/getByTeacher/', getLessonByTeacher)

router.delete('/deleteAlllessons/', deleteAlllessons)
module.exports = router;
