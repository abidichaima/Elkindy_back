require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const courseRoutes = require("./routes/courseRoute");
const lessonRoutes = require("./routes/lessonRoute");
const freeTimeRoutes = require("./routes/freeTimeRoute");
const holidayRoutes = require("./routes/holidaysRoute");


const questionRoute= require ('./routes/question');
const quizzRoute= require ('./routes/quizz');
const resultRoute= require ('./routes/quizzResult');


const cookieParser = require("cookie-parser");
require("dotenv").config();
const bodyParser = require('body-parser');
const passport = require("passport");
const passportStrategy = require("./passport");
const cookieSession = require("cookie-session");
const session = require('express-session');


const app = express();



app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST",  "DELETE", "PUT", "OPTIONS", "PUT"],
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
app.use('/api/course', courseRoutes);
app.use('/api/lesson', lessonRoutes);
app.use('/api/freeTime', freeTimeRoutes);
app.use('/api/holiday', holidayRoutes);

app.use((err, req, res, next) => {

  console.error(err.stack);
  res.status(500).json({ error: err.message });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});



//EVENT MANAGEMENT 




require('dotenv').config();
const errorHandler = require('./middlewares/error');

// Routes
const eventsRoute = require('./routes/events');
const paymentRouter = require("./routes/payment")
const ticketsRoute = require('./routes/tickets');
const commentRoute = require('./routes/commentRoutes');


// CONNECT DATABASE
mongoose.connect('mongodb+srv://artweb:elkindy@elkindy.awubkgs.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));
  

// MIDDLEWARE
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({     
  limit: '100mb',
  extended: true
  }));
app.use(cors());
app.use(express.json());

app.use("/api",paymentRouter)
app.use('/tickets', ticketsRoute);
app.use('/events', eventsRoute);
app.use('/comment', commentRoute);
app.use('/question',questionRoute);
app.use('/quizz',quizzRoute);
app.use('/result',resultRoute);
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//ERROR MIDDLEWARE
app.use(errorHandler);


/*const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
})*/


app.listen(4000, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Server Started Successfully.");
    }
  });
  
module.exports = app;