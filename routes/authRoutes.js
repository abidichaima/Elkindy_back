const { register, login } = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();
router.post("/", (req, res) => {
    console.log("Received POST request at /");
    checkUser(req, res);
  });
  
  router.post("/register", (req, res) => {
    console.log("Received POST request at /register");
    register(req, res);
  });
  
  router.post("/login", (req, res) => {
    console.log("Received POST request at /login");
    login(req, res);
  });

  
router.post("/", checkUser); 
router.post("/register", register);
router.post("/login", login);

module.exports = router;
