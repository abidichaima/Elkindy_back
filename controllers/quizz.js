const mongoose = require('mongoose');
const Question = require('../models/Question');
const Quizz = require('../models/Quizz');
const Response = require('../models/Response');
const qr = require('qrcode');
const fs = require('fs');
const path = require('path');
const { log } = require('console');

exports.createQuizz = async (req, res, next) => {
  try {
    const { titre, description, duree, dateDebut, dateFin,level ,questions } = req.body;
    console.log(req.body.questions);
    const selectedQuestionIds = questions.map(question => mongoose.Types.ObjectId(question.value));
    console.log(selectedQuestionIds);
    const quizz = new Quizz({ titre, description, duree, dateDebut, dateFin,level, questions: selectedQuestionIds });
    const savedQuizz = await quizz.save();
    res.status(201).json({ message: 'Quizz créé avec succès', quizz: savedQuizz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.QrCode = async (req, res, next) => {
  try {
    const userId = req.user.id; 
    const quizId = req.params.quizId; 
    const directory = path.join(__dirname, '..', 'qr_codes');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    const qrData = `User ID: ${userId}, Quiz ID: ${quizId}`;

    const filePath = path.join(directory, `${userId}_${quizId}.png`);

    qr.toFile(filePath, qrData, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la génération du QR code.' });
        return;
      }
      console.log('QR code généré avec succès.');
      res.sendFile(filePath);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Une erreur s\'est produite.' });
  }
};
exports.getAllQuizz = (req, res, next) => {
  Quizz.find()
    .populate({
      path: 'questions',
      populate: { path: 'responses' } 
    }) 
    .exec()
    .then((quizzs) => {
      res.status(200).json(quizzs);
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message
      });
    });
};
exports.deleteQuizz = async (req, res, next) => {
  try {
    const quizz = await Quizz.findOne({ _id: req.params.id });
    await Quizz.deleteOne({ _id: quizz._id });
    
    res.status(200).json({ message: 'Quizz  deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getQuizz = async (req, res, next) => {
  try {
    const quizz = await Quizz.findOne({ _id: req.params.id }).populate({
      path: 'questions',
      populate: {
        path: 'responses'
      }
    });
    const formattedQuestions = quizz.questions.map(question => {
      return {
        ennonce: question.ennonce,
        image: question.image,
        responses: question.responses.map(response => {
          return {
            content: response.content,
            isCorrect: response.isCorrect
          };
        })
      };
    });

    const quizzz = {
      titre: quizz.titre,
      description: quizz.description,
      duree: quizz.duree,
      dateDebut: quizz.dateDebut,
      dateFin: quizz.dateFin,
      questions: formattedQuestions
    };

    res.status(200).json({ message: 'Quizz retrieved successfully', quizz: quizzz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};