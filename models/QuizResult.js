const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quizz', 
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  responses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question', 
      required: true
    },
    userAnswer: {
      type: mongoose.Schema.Types.Mixed, 
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  /*durationTaken: {
    type: Number 
  },*/
  
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
