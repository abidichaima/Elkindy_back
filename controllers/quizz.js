const mongoose = require('mongoose');
const Question = require('../models/Question');
const Quizz = require('../models/Quizz');
const Response = require('../models/Response');
const qr = require('qrcode');
const fs = require('fs');
const path = require('path');
const { log } = require('console');
const QuizResult = require('../models/QuizResult');
const { spawn } = require('child_process');
const { exec } = require('child_process');
/*exports.createQuizz = async (req, res, next) => {
  try {
    const { titre, description, duree, dateDebut, dateFin,level ,questions,tentative } = req.body;
    console.log(req.body.questions);
    const selectedQuestionIds = questions.map(question => mongoose.Types.ObjectId(question.value));
    console.log(selectedQuestionIds);
    const quizz = new Quizz({ titre, description, duree, dateDebut, dateFin,level, questions: selectedQuestionIds,tentative:tentative});
    const savedQuizz = await quizz.save();
    res.status(201).json({ message: 'Quizz créé avec succès', quizz: savedQuizz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};*/
exports.createQuizz = async (req, res, next) => {
  try {
    const { titre, description, duree, dateDebut, dateFin, level, questions, tentative } = req.body;
    console.log(req.body.questions);
    const selectedQuestionIds = questions.map(question => mongoose.Types.ObjectId(question.value));
    console.log(selectedQuestionIds);
    
    let totals = 0; // Initialiser total à zéro

    for (const questionId of selectedQuestionIds) {
      const question = await Question.findById(questionId);
      if (question) {
        console.log("question.point", question.point);
        totals += question.point;
        console.log("totalPoints", totals);
      }
    }

    console.log('Total points before validation:', totals);

    // Créer le quiz avec la somme des points calculée
    const quizz = new Quizz({
      titre,
      description,
      duree,
      dateDebut,
      dateFin,
      level,
      questions: selectedQuestionIds,
      tentative,
      total: totals
    });

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
    await QuizResult.deleteMany({ quizId: quizz._id });

    await Quizz.deleteOne({ _id: quizz._id });

    res.status(200).json({ message: 'Quiz deleted along with its results' });
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
        id:question._id,
        ennonce: question.ennonce,
        point:question.point,
        image: question.image,
        responses: question.responses.map(response => {
          return {
            id:response._id,
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
      questions: formattedQuestions,
      tentative:quizz.tentative,
      total:quizz.total,
    };
console.log(quizz);
    res.status(200).json({ message: 'Quizz retrieved successfully', quizz: quizzz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.modifyQuizz = async (req, res, next) => {
  try {
    const { titre, description, duree, dateDebut, dateFin, level, questions ,tentative} = req.body;
console.log("anc",req.body.questions);
    // Convertir les identifiants des questions en ObjectId
   
    const updatedQuizz = await Quizz.findByIdAndUpdate(
      req.params.id, 
      { titre, description, duree, dateDebut, dateFin, level, questions: questions ,tentative:tentative},
      { new: true } 
    );
  
    console.log("updatedQuizz", updatedQuizz);
    res.status(200).json({ message: 'Quizz modifié avec succès', quizz: updatedQuizz });
  } catch (error) {
    console.error('Erreur lors de la modification du quizz :', error);
    res.status(500).json({ error: error.message });
  }
};





exports.getQuestions = async (req, res, next) => {
 
    
    try {
      const quizz = await Quizz.findOne({ _id: req.params.id }).populate({
        path: 'questions',
      });
      const formattedQuestions = quizz.questions.map(question => question.ennonce);

  console.log("formattedQuestions",formattedQuestions);
        

    // Exécuter le script Python pour récupérer les questions du quiz spécifié
    const pythonProcess = spawn('python', [path.join(__dirname, 'ScriptQuizz', 'script.py'), ...formattedQuestions]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        // Si le script Python se termine avec succès, renvoyer une réponse avec les questions récupérées
        res.status(200).json({ success: true, message: 'Questions retrieved successfully'});
      } else {
        res.status(500).json({ success: false, message: 'Failed to retrieve questions' });
      }
    });
  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSimilaires = async (req, res, next) => {
  try {
    // Chemin du fichier contenant les données
    const filePath = path.join(__dirname, 'similar_quizzes.json');

    // Lire les données du fichier JSON
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const similarQuizzes = JSON.parse(fileContent);

    // Traitez les données comme vous le souhaitez
    console.log("Données récupérées depuis le fichier JSON :", similarQuizzes);

    // Envoyez une réponse indiquant que les données ont été récupérées avec succès
    res.status(200).json({ similarQuizzes });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    res.status(500).json({ message: "Une erreur s'est produite lors du traitement des données." });
  }
};