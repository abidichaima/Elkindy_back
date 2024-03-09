const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  ennonce: { type: String, required: true },
  image: {
    type: {
      public_id: String,
      url: String
    },
    required: false
  },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Response' }]
 
});

module.exports = mongoose.model('Question', questionSchema);