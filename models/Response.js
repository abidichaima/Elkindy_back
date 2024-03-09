const mongoose = require('mongoose');

const responseSchema = mongoose.Schema({
  content: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
 
});

module.exports = mongoose.model('Response', responseSchema);