const express = require('express');
const router = express.Router();
const quizzController= require('../controllers/quizz');

router.post('/add', quizzController.createQuizz);
router.get('/showall', quizzController.getAllQuizz);
router.delete('/delete/:id', quizzController.deleteQuizz);
router.get('/show/:id', quizzController.getQuizz);
router.put('/update/:id', quizzController.modifyQuizz);
router.post('/get/:id',quizzController.getQuestions);
router.get('/similar',quizzController.getSimilaires);


router.post('/qrcode', quizzController.QrCode);
module.exports = router;