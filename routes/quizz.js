const express = require('express');
const router = express.Router();
const quizzController= require('../controllers/quizz');

router.post('/add', quizzController.createQuizz);
router.get('/showall', quizzController.getAllQuizz);
router.delete('/delete/:id', quizzController.deleteQuizz);
router.get('/show/:id', quizzController.getQuizz);

router.post('/qrcode', quizzController.QrCode);
module.exports = router;