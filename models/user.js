const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function(value) {
        // You can use a regular expression for basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
  },
  confirmPassword: { // Add this line to include confirmPassword field
    type: String,

  },
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "student",
  },

  phoneNumber: {
    type: String,
    validate: {
      validator: function(value) {
        // You can use a regular expression for basic phone number format validation
        const phoneRegex = /^[0-9]{8}$/; // Assumes a 10-digit phone number
        return phoneRegex.test(value);
      },
      message: 'Please enter a valid phone number (8 digits)'
    }
  },
  level: {
    type: String,
    
  },

  verified: { type: Boolean, default: false },
  speciality : [{ type: String }], // Array to store multiple specialties
  image: {
    public_id: {
        type: String,
    },
    url: {
        type: String,
    }

  },
  //sami
  freeTime: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreeTime'
  }],
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }] ,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] ,
  //end sami
});


userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id ,  firstName: this.firstName,
    lastName: this.lastName,
    email: this.email, level : this.level , role : this.role , phoneNumber : this.phoneNumber , image: this.image}, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

/*
userSchema.methods.generateNewToken = function() {
  const refreshToken  = jwt.sign({ 
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      level: this.level,
      role: this.role,
      phoneNumber: this.phoneNumber,
      image: this.image
  }, process.env.JWTPRIVATEKEY, {
      expiresIn: "7d",
  });
  return refreshToken ;
};

*/


const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().label("firstName"),
    lastName: Joi.string().label("lastName"),
    level: Joi.string().label("level"),
    phoneNumber: Joi.string().label("phoneNumber"),
    email: Joi.string().email().label("email"),
    password: passwordComplexity().label("password"),
    confirmPassword: Joi.string(), // Ensure confirmPassword is included in the schema
    image: Joi.string(), // Ensure confirmPassword is included in the schema

    role: Joi.string().valid("admin", "teacher", "student").default("student").label("Role"),
  });
  return schema.validate(data);
};

/*userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Si le mot de passe n'a pas été modifié, passez à la prochaine middleware
  }
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});*/
const User = mongoose.model("users", userSchema);
module.exports = { User, validate };