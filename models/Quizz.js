const mongoose = require('mongoose');

const quizzSchema = mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  duree: { type: Number, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  level: { type: String }
});

module.exports = mongoose.model('Quizz', quizzSchema);