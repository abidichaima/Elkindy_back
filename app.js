const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
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
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST","DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.json());
app.use("/", authRoutes);



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