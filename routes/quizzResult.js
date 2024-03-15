const express = require('express');
const router = express.Router();
const ResultController= require('../controllers/quizzResult');

router.post('/add', ResultController.addQuizResult);
router.get('/showall', ResultController.getQuizResults);
router.get('/show/:id', ResultController.getQuizResultsById);

module.exports = router;