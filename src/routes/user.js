const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validations");
const auth = require("../middlewares/auth");
const userController = require("../controllers/user");

router.get("/", userController.getAllUsers);

router.post("/", validate.signup, userController.signupUser);

router.post("/login", validate.login, userController.loginUser);

router.get("/profile", auth.verifyToken, userController.getUser);

router.put("/", auth.verifyToken, userController.updateUser);

router.get("/nearby-users", auth.verifyToken, userController.getNearByUsers);

router.delete("/:id", userController.removeUser);

module.exports = router;
