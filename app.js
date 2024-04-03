const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const bodyParser = require('body-parser');
const passport = require("passport");
const passportStrategy = require("./passport");
const cookieSession = require("cookie-session");
const session = require('express-session');

const app = express();

app.listen(4000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server Started Successfully.");
  }
});
mongoose.connect('mongodb+srv://artweb:elkindy@elkindy.awubkgs.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((error) => console.error('Connexion à MongoDB échouée !', error));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
  })
);

app.use(
	cookieSession({
		name: "session",
		keys: ["cyberwolve"],
		maxAge: 24 * 60 * 60 * 100,
	})
);

app.use(session({
  secret: ' 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', // Changez ceci avec une clé secrète réelle
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

console.log(process.env.CLOUD_NAME, process.env.CLOUD_KEY, process.env.CLOUD_KEY_SECRET);

app.use(express.json({ limit: '50mb' }));

app.use("/user/users", userRoutes);
app.use("/user", authRoutes);