const mongoose = require('mongoose');
const Question = require('../models/Question');
const Quizz = require('../models/Quizz');
const Response = require('../models/Response');
const QuizResult = require('../models/QuizResult');
const User=require('../models/user');

exports.addQuizResult = async (req, res) => {
  try {
    const { userId, quizId, score, responses } = req.body;

    // Convertir la chaîne JSON en objet JavaScript
    const parsedResponses = JSON.parse(responses);

    // Formatter les réponses correctement
    const formattedResponses = parsedResponses.map(element => ({
      questionId: element.question.id, // Utiliser l'ID de la question
      selectedOptions: element.selectedOptions.map(option => option) // Extraire les contenus des options sélectionnées
    }));

    console.log("Formatted Responses:", formattedResponses);

    // Créer un nouvel objet QuizResult avec les données nécessaires
    const newQuizResult = new QuizResult({
      userId,
      quizId,
      score,
      responses: formattedResponses
    });
    console.log("Forfffffffmatted Responses:", newQuizResult);

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
      .populate('userId', 'firstName lastName level ') 
      .populate('quizId', 'titre'); 

    res.status(200).json(quizResults);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getQuizResultsById = async (req, res) => {
  try {
    const quizResult = await QuizResult.findById(req.params.id)
      .populate({
        path: 'userId',
        select: '-password',
      })
      
      .populate({
        path: 'quizId',
        populate: {
            path: 'questions'
        }
    }).populate({
        path: 'responses.questionId',
        populate: {
          path: 'responses'
        }
      });
      console.log("e",quizResult);
    if (!quizResult) {
      return res.status(404).json({ message: 'Aucun résultat de quiz trouvé pour cet ID.' });
    }

   
    res.status(200).json(quizResult);
  } catch (error) {
   
    res.status(500).json({ message: error.message });
  }
};
exports.getQuizUser = async (req, res) => {
  try {
    const { userId, quizId } = req.params;
    const userAttempts = await QuizResult.find({ userId, quizId })
      .populate({
        path: 'responses.questionId',
        populate: {
          path: 'responses'
        }
      });
    res.json(userAttempts);
  } catch (error) {
    console.error('Error fetching user attempts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.deleteAllResults = async (req, res) => {

  try {
    await QuizResult.deleteMany({});
    console.log('Toutes les entrées de la collection Result ont été supprimées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression des entrées de la collection Result :', error);
  }
};
exports.deleteRes = async (req, res, next) => {
  try {
    const result = await QuizResult.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
  
    await QuizResult.deleteOne({ _id: result._id });
    res.status(200).json({ message: 'Result deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};