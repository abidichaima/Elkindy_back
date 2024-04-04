const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const questionController= require('../controllers/question');

router.post('/add', upload.none(), questionController.createQuestion);
router.get('/showall', questionController.getAllQuestion);
router.get('/show/:id', questionController.getQuestion);
router.put('/update/:id', questionController.modifyQuestion);
router.delete('/delete/:id', questionController.deleteQuestion);

module.exports = router;