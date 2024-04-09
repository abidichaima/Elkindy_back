
const router = require("express").Router();
const { User } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passport = require("passport");
const session = require('express-session');


router.post("/logiin", async (req, res) => {
	const { email, password } = req.body;
  
	try {
	  // Find the user by email
	  const user = await User.findOne({ email });
  
	  // If user not found, return 401 Unauthorized
	  if (!user) {
		return res.status(401).json({ message: 'Invalid Email or Password' });
	  }
  
	  // Compare the entered password with the hashed password
	  bcrypt.compare(password, user.password, (err, result) => {
		if (err) {
		  console.error('Error comparing passwords:', err);
		  return res.status(500).json({ message: 'Internal Server Error' });
		}
		
		if (result) {
		  // Passwords match, generate token or perform other actions
		  const token = generateToken(user._id);
		  return res.status(200).json({ token, message: 'Login successful' });
		} else {
		  // Passwords do not match, return 401 Unauthorized
		  return res.status(401).json({ message: 'Invalid Email or Password' });
		}
	  });
	} catch (error) {
	  console.error('Error during login:', error);
	  return res.status(500).json({ message: 'Internal Server Error' });
	}
  });
  
  // Helper function to generate token (you need to implement this)
  const generateToken = (userId) => {
	// Implement your token generation logic here
  };

  router.post("/nonhashed", async (req, res) => {
	try {
	  const { password, hashedPassword } = req.body;
  
	  // Compare the entered password with the hashed password
	  bcrypt.compare(password, hashedPassword, (err, result) => {
		if (err) {
		  console.error('Error comparing passwords:', err);
		  return res.status(500).json({ message: 'Internal Server Error' });
		}
		
		if (result) {
		  // Passwords match, return the original password
		  return res.status(200).json({ originalPassword: password });
		} else {
		  // Passwords do not match
		  return res.status(401).json({ message: 'Passwords do not match' });
		}
	  });
	} catch (error) {
	  console.error('Error retrieving password:', error);
	  return res.status(500).json({ message: 'Internal Server Error' });
	}
  });
// The routes should use the correct HTTP methods (e.g., GET, POST, PUT, DELETE)
router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

			const user = await User.findOne({ email: req.body.email });
			if (!user)
			return res.status(401).send({ message: "Invalid Email or Password" });

		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid Email or Password" });

		if (!user.verified) {
			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();

				const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
				await sendEmail(user.email, "Verify Email", url);

			
console.log("BASE_URL:", BASE_URL);
			}
			console.log("BASE_URL:", BASE_URL);

			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}

		const token = user.generateAuthToken();
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		console.error("Error during login:", error);

		return res.status(500).send({ message: "Internal Server Error", error: error.message });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

const secretKey = crypto.randomBytes(64).toString('hex');

console.log(secretKey);


router.get(
	"/auth/google/callback",
	passport.authenticate("google", {
		successRedirect: process.env.CLIENT_URL,
		failureRedirect: "/404",
	})
);
module.exports = router;
