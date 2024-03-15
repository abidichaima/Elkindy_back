const mongoose = require('mongoose');
const Question = require('../models/Question');
const Quizz = require('../models/Quizz');
const Response = require('../models/Response');
const QuizResult = require('../models/QuizResult');
const User=require('../models/authModel');

exports.addQuizResult = async (req, res) => {
  try {
    const { userId, quizId, score, responses } = req.body;

    const formattedResponses = [];
    for (const response of responses) {
      
      const { question, userAnswer, isCorrect } = response;
      const questionId=question.questionId
      formattedResponses.push({ questionId, userAnswer, isCorrect });
    }
console.log(formattedResponses);
    // Créer un nouvel objet QuizResult avec les données nécessaires
    const newQuizResult = new QuizResult({
      userId,
      quizId,
      score,
      responses: formattedResponses
    });

    // Sauvegarder le nouvel objet QuizResult dans la base de données
    const savedQuizResult = await newQuizResult.save();

    // Répondre avec le résultat sauvegardé
    res.status(201).json(savedQuizResult);
  } catch (error) {
    // En cas d'erreur, répondre avec un code d'erreur 500 et un message d'erreur
    res.status(500).json({ message: error.message });
  }
};
exports.getQuizResults = async (req, res) => {
  try {
    const quizResults = await QuizResult.find()
      .populate('userId', 'firstName lastName level ') // Populer l'utilisateur avec le prénom et le nom de famille uniquement
      .populate('quizId', 'titre'); // Populer le quiz avec son titre uniquement

    // Retourner les résultats sous forme de réponse JSON
    res.status(200).json(quizResults);
  } catch (error) {
    // En cas d'erreur, retourner un message d'erreur avec le statut 500
    res.status(500).json({ message: error.message });
  }
};
exports.getQuizResultsById = async (req, res) => {
  try {
    const quizResult = await QuizResult.findById(req.params.id)
      .populate({
        path: 'userId',
        select: '-password', // Exclure le champ password de l'utilisateur
      })
      .populate({
        path: 'quizId',
        populate: {
          path: 'questions',
          model: 'Question'
        }
      })
      .populate('responses');

    // Si aucun résultat n'est trouvé pour l'ID donné, retourner un message d'erreur avec le statut 404
    if (!quizResult) {
      return res.status(404).json({ message: 'Aucun résultat de quiz trouvé pour cet ID.' });
    }

    // Retourner le résultat du quiz sous forme de réponse JSON
    res.status(200).json(quizResult);
  } catch (error) {
    // En cas d'erreur, retourner un message d'erreur avec le statut 500
    res.status(500).json({ message: error.message });
  }
};