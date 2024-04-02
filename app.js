const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoute");
const lessonRoutes = require("./routes/lessonRoute");
const freeTimeRoutes = require("./routes/freeTimeRoute");
const holidayRoutes = require("./routes/holidaysRoute");

const cookieParser = require("cookie-parser");

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
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use("/", authRoutes);
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


const bodyParser = require('body-parser');

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

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//ERROR MIDDLEWARE
app.use(errorHandler);


/*const port = process.env.PORT || 4000;
app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
})*/

module.exports = app;