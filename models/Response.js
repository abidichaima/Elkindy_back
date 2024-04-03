const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
  content: { type: String, required: true },
  img :{type: String, required: false },
  isCorrect: { type: Boolean, required: true },
 
});

module.exports = mongoose.model('Response', responseSchema);