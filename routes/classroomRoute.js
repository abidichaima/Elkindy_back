const express = require("express");
const { createClassroom, deleteClassroom, updateClassroom, getClassroom,getAllClassrooms } = require("../controllers/classroomController");


const router = express.Router();

router.post('/create', createClassroom);
router.delete('/delete/:id', deleteClassroom);
router.put('/update/:id', updateClassroom)
router.get('/get/:id',getClassroom)
router.get('/get', getAllClassrooms)


module.exports = router;
