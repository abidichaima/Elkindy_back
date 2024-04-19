const express = require('express');
const router = express.Router();
const ResultController= require('../controllers/quizzResult');

router.post('/add', ResultController.addQuizResult);
router.get('/showall', ResultController.getQuizResults);
router.get('/show/:id', ResultController.getQuizResultsById);
router.get('/user/:userId/quiz/:quizId',ResultController.getQuizUser),
router.delete('/all',ResultController.deleteAllResults),
router.delete('/delete/:id',ResultController.deleteRes),
router.get('/grade/:grade',ResultController.getQuizResultsByGradeLevel),


module.exports = router;