const mongoose = require('mongoose');

const quizzSchema = mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  duree: { type: Number, required: true },
  total: { type: Number, required: false },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  level: { type: String },
  tentative : { type: Number, required: true }
});

module.exports = mongoose.model('Quizz', quizzSchema);