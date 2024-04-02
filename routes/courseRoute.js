const express = require("express");
const { createCourse, deleteCourse, updateCourse, getCourse,getAllCourses } = require("../controllers/courseController");


const router = express.Router();

router.post('/create', createCourse);
router.delete('/delete/:id', deleteCourse);
router.put('/update/:id', updateCourse)
router.get('/get/:id',getCourse)
router.get('/get', getAllCourses)


module.exports = router;
