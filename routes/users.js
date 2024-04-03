const router = require("express").Router();
const { User, validate } = require("../models/user");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');  // Assurez-vous que cette ligne est présente
const nodemailer = require("nodemailer");
const {  getAllUsers, getUserById, updateUser, deleteUser, addUser,getUsersByRole } = require("../controllers/authControllers");

router.post("/" ,async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);
		const hashConfirmPassword = await bcrypt.hash(req.body.confirmPassword, salt);

		user = await new User({ ...req.body, password: hashPassword , confirmPassword : hashConfirmPassword }).save();

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		
		}).save();
		const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
		await sendEmail(user.email, "Verify Email", url);

		res
			.status(201)
			.send({ message: "An Email sent to your account please verify" });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.get("/:id/verify/:token/", async (req, res) => {
	try {
	   const user = await User.findOne({ _id: req.params.id });
	   if (!user) throw new Error("Invalid link");
 
	   const token = await Token.findOne({
		  userId: user._id,
		  token: req.params.token,
	   });
 
	   if (!token) throw new Error("Invalid link");
 
	   // Mettez à jour le champ 'verified' plutôt que '_id'
	   await User.updateOne({ _id: user._id }, { $set: { verified: true } });
	   await token.remove();
 
	   res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
	   console.error(error);
	   res.status(500).send({ message: "Internal Server Error" });
	}
 });



 router.post('/forgot-password', (req, res) => {
    const {email} = req.body;
	User.findOne({ email: req.body.email })    .then(user => {
        if(!user) {
            return res.send({Status: "User not existed"})
        } 
		const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "1d" });
        var transporter = nodemailer.createTransport({
            service: 'gmail',
			auth: {
                user: 'chaimaabidi1406@gmail.com',
                pass: 'alfz uyju btme lofm'
            }
          });
          
          var mailOptions = {
            from: 'chaimaabidi1406@gmail.com',
            to: email,
            subject: 'Reset Password Link',
            text: `http://localhost:3000/reset_password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
})
router.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                User.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
})


// Middleware pour vérifier le refresh token
const verifyRefreshToken = (req, res, next) => {
	const refreshToken = req.body.refreshToken;
  
	// Vérifier si le refresh token est valide
	jwt.verify(refreshToken, 'refreshSecret', (err, decoded) => {
	  if (err) {
		return res.status(403).json({ message: 'Refresh token invalide' });
	  }
	  req.decoded = decoded;
	  next();
	});
  };
  
  // Route pour rafraîchir le token d'accès
  router.post('/refresh', verifyRefreshToken, (req, res) => {
	// Générer un nouveau token d'accès
	const user = req.decoded;
	const accessToken = jwt.sign({ id: user.id }, 'accessSecret', { expiresIn: '1500000m' });
  
	// Envoyer le nouveau token d'accès au client
	res.status(200).json({ accessToken });
  });

  router.get('/search/:email', async (req, res) => {
	try {
	  const email = req.params.email; // Récupérer l'e-mail de l'URL
	  const users = await User.find({ email: { $regex: email, $options: 'i' } });
	  res.json(users); // Renvoyer les résultats de la recherche
	} catch (error) {
	  console.error('Error searching users:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });
  

router.get("/getAllUsers", getAllUsers);
router.post("/addUser", addUser);


router.get("/users/:id", getUserById);
router.put("/updateUser", updateUser);
console.log('Received PUT request to /user/users/updateUser');

router.delete("/deleteUser/:id", deleteUser);

router.get('/users/role/:role', getUsersByRole);

module.exports = router;