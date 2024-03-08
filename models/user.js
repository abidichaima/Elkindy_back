const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First Name is Required"],
  },
  lastName: {
    type: String,
    required: [true, "Last Name is Required"],
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
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
    required: [true, "Password is Required"],
  },
  role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "student",
  },

  phoneNumber: {
    type: String,
    required: [true, "Phone Number is Required"],
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


});


userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "7d",
	});
	return token;
};

const User = mongoose.model("users", userSchema);

const validate = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().required().label("FirstName"),
		lastName: Joi.string().required().label("LastName"),
    phoneNumber: Joi.string().required().label("phoneNumber"),
		email: Joi.string().email().required().label("email"),
		password: passwordComplexity().required().label("password"),
    role: Joi.string().valid("admin", "teacher", "student").default("student").label("Role"),
  });
	return schema.validate(data);
};

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = { User, validate };