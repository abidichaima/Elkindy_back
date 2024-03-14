const Question = require('../models/Question');
const Response = require('../models/Response');
const cloudinary = require('../cloudinary/cloudinary');

exports.createQuestion = async (req, res, next) => {
  try {
    const { ennonce, image, responsesData } = req.body;
    console.log("req.body",req.body);
    const responsesDataObj = JSON.parse(responsesData);
    let imageDetails = {};
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: 'Question_image'
      });
      imageDetails = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      };
    }
    const question = new Question({ ennonce, image: imageDetails });
    const savedQuestion = await question.save();
    const responses = [];
    for (const responseData of responsesDataObj) {
      const response = new Response({ content: responseData.content, isCorrect: responseData.isCorrect });
      const savedResponse = await response.save();
      responses.push(savedResponse._id);
    }
   savedQuestion.responses = responses;
    await savedQuestion.save();
    res.status(201).json({ message: 'Question ajoutée avec succès', question: savedQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllQuestion = (req, res, next) => {
  Question.find()
    .populate('responses') 
    .exec()
    .then((questions) => {
      res.status(200).json(questions);
    })
    .catch((error) => {
      res.status(400).json({
        error: error.message
      });
    });
};
exports.modifyQuestion = async (req, res, next) => {
  try {
    const { ennonce, image, responses } = req.body;
    let imageDetails = {};
    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: 'Question_image'
      });
      imageDetails = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      };
    } else {
      const existingQuestion = await Question.findById(req.params.id);
      if (existingQuestion && existingQuestion.image) {
        imageDetails = {
          public_id: existingQuestion.image.public_id,
          url: existingQuestion.image.url
        };
      } else {
        imageDetails = null;
      }
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id, 
      { ennonce: ennonce, image: imageDetails },
      { new: true } 
    );
  console.log("updatedQuestion",updatedQuestion);
    res.status(200).json({ message: 'Question modifiée avec succès', question: updatedQuestion });
  } catch (error) {
    console.error('Error modifying question:', error);
    res.status(500).json({ error: error.message });
  }
};



exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findOne({ _id: req.params.id }).populate('responses');
    await Question.deleteOne({ _id: question._id });
    await Response.deleteMany({ _id: { $in: question.responses.map(response => response._id) } });
    res.status(200).json({ message: 'Question and associated responses deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findOne({ _id: req.params.id }).populate('responses');
    const responses = question.responses.map(responseData => {
      return {
        content: responseData.content,
        isCorrect: responseData.isCorrect
      };
    });
    const questions = {
      ennonce: question.ennonce,
      image: question.image,
      responsesData: responses
    };

    res.status(200).json({ message: 'Question retrieved successfully', question: questions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


 