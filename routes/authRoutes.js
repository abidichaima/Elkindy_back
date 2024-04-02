const { register, login, getAllUsers, getUserById, updateUser, deleteUser,getUsersByRole } = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

// The routes should use the correct HTTP methods (e.g., GET, POST, PUT, DELETE)
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

router.get("/getAllUsers", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/deleteUser/:id", deleteUser);
router.get('/users/role/:role', getUsersByRole);


module.exports = router;
