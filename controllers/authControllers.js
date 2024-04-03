const User = require("../models/user").User;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const cloudinary = require('../utils/cloudinary');
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/token");
const crypto = require("crypto");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "kishan sheth super secret key", {
    expiresIn: maxAge,
  });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  console.log(err);
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (err.code === 11000) {
    errors.email = "Email is already registered";
    return errors;
  }

  if (err.message.includes("Users validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, level, phoneNumber ,        confirmPassword
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword, // Save the hashed password
      firstName,
      lastName,
      level,
      phoneNumber,
  
      confirmPassword,

    
    });

    const token = createToken(user._id);

    // Do not include the password in the email content
    sendWelcomeEmail(email, password);

    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id, created: true });
  

  } catch (err) {
    console.log(err);
    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};



module.exports.addUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, level, phoneNumber, role, speciality, image } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      folder: "products",
      // width: 300,
      // crop: "scale"
    })
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur dans la base de données
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      level,
      phoneNumber,
      role,
      speciality,
      image: {
        public_id: result.public_id,
        url: result.secure_url
      }
    });

    // Génération du token JWT

		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		
		}).save();
    // Configurez le cookie JWT
    res.cookie('jwt', token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: maxAge * 1000,
    });
    console.log('User created:', user); // Vérifiez si l'utilisateur est correctement créé
    console.log('Token:', token); // Vérifiez si le token est correctement généré
    // Envoyer la réponse avec l'ID de l'utilisateur créé
    // Envoi de l'e-mail de vérification
    await sendVerificationEmail(user.email, user._id, token);
    sendWelcomeEmail(user.email, password);

    res.status(201).json({ user: user._id, created: true });
  } catch (err) {
    console.log(err);


    const errors = handleErrors(err);
    res.json({ errors, created: false });
  }
};

// Fonction pour envoyer un e-mail de vérification
async function sendVerificationEmail(email, userId, token) {
  try {
    const url = `${process.env.BASE_URL}users/${userId}/verify/${token.token}`;
    await sendEmail(email, "Verify Email", url);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}



// Fonction pour envoyer un e-mail de bienvenue
function sendWelcomeEmail(email, password) {
  // Configurez nodemailer avec vos informations d'identification de service de messagerie
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Set to false because we are using TLS
    requireTLS: true, // Force TLS
    auth: {
      user: 'chaimaabidi1406@gmail.com',
      pass: 'alfz uyju btme lofm',
    },
  });

  // Contenu de l'e-mail
  const mailOptions = {
    from: 'chaimaabidi1406@gmail.com',
    to: email,
    subject: 'Welcome to Your App',
    text: `Thank you for creating an account!\n\nYour email: ${email}\nYour password: ${password}`,
  };

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Email could not be sent:', error.message);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Fonction pour envoyer un e-mail de vérification

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: false, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id, status: true });
  } catch (err) {
    const errors = handleErrors(err);
    res.json({ errors, status: false });
  }
};


module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load users. Please check the server logs for more information." });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, level, speciality, role, verified, image } = req.body;
    console.log('avant updatedddd', req.body);
    let imageDetails = {};
    if (image) {
      // Si une nouvelle image est fournie dans la requête, la télécharger vers Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: 'products'
      });
      imageDetails = {
        public_id: uploadedImage.public_id,
        url: uploadedImage.secure_url
      };
    } else {
      // Si aucune nouvelle image n'est fournie, récupérer les détails de l'image de l'utilisateur existant
      const existingUser = await User.findById(req.params.id);
      if (existingUser && existingUser.image) {
        imageDetails = {
          public_id: existingUser.image.public_id,
          url: existingUser.image.url
        };
      }
    }
    console.log('en cours updatedddd', req.body);
    const userId = req.body.id; // Assuming the user ID is passed in the request body

    // Mettre à jour l'utilisateur en incluant les détails de l'image si disponibles
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        level: level,
        speciality: speciality,
        role: role,
        verified: verified,
        image: imageDetails // Utiliser les détails de l'image récupérés
      },
    );
    console.log('updatedddd', updatedUser);
    console.log('id', userId);
  

    if (!updatedUser) {
      // Si updatedUser est null, cela signifie que l'utilisateur n'a pas été trouvé
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    }
   // Générer un nouveau token JWT
   const newToken = createToken(userId);

   // Configurez le cookie JWT avec le nouveau token
   res.cookie('jwt', newToken, {
     withCredentials: true,
     httpOnly: false,
     maxAge: maxAge * 1000,
   });
console.log (newToken)
    // Si tout s'est bien passé, vous pouvez renvoyer l'utilisateur mis à jour
    res.status(200).json({ message: 'Utilisateur modifié avec succès', user: updatedUser });
  } catch (error) {
    console.error('Error modifying user:', error);
    res.status(500).json({ error: error.message });
  }
};

/*
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.body.id; // Assuming the user ID is passed in the request body

    const user = await User.findById(userId);
    console.log("User found:", user);


    // Update the image if provided
    if (req.body.image !== null) {
      const ImgId = user.image.public_id;
      if (ImgId) {
        await cloudinary.uploader.destroy(ImgId);
      }
      const result = await cloudinary.uploader.upload(req.body.image, {
        folder: "products",
        // width: 300,
        // crop: "scale"
      });
      user.image = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

   
    if (!user) {
      console.log("User not found");
      res.status(404).send("User not found");
      return;
    }

    // Update the fields based on the request body
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key) && user[key] !== undefined) {
        user[key] = req.body[key];
      }
    }

    await user.save();

    console.log("User updated successfully:", user);
    res.send("User updated successfully");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Internal Server Error");
  }
};
*/

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (deletedUser) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


module.exports.getUsersByRole = async (req, res, next) => {
  try {
    const { role } = req.params;
    const users = await User.find({ role: role });

    if (!users.length) {
      return next(errorHandler(404, `No users found with role ${role}`));
    }

    console.log(`Users with role ${role} retrieved`);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};