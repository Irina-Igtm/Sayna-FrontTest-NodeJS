var express = require("express");
const AuthController = require("../controllers/AuthController");
const verifyToken = require("../middlewares/authenticate");
var router = express.Router();

// router.post("/", AuthController.register);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/user/cart", verifyToken, AuthController.CarteBancaire);
router.get("/typeAbonnement", verifyToken, AuthController.typeAbonnement);
router.post("/getCartes", verifyToken, AuthController.getCartesByUser);
router.put("/subscription", verifyToken, AuthController.subscription);
router.post("/getAbonnement", verifyToken, AuthController.getAbonnementByUser)
router.delete("/user/off", verifyToken, AuthController.deconnection)
router.delete("/user", verifyToken, AuthController.deleteUser)
router.get("/songs", verifyToken, AuthController.getMusic)
router.get("/songs/:id", verifyToken, AuthController.getMusicById)
router.put("/user", verifyToken, AuthController.updateUser);
router.get("/user/:id", verifyToken, AuthController.getUserById);
module.exports = router;