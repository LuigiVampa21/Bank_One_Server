const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
// const multerMiddleware = require("../utils/multer");

router.route("/register").post(
  // multerMiddleware.multerM,
  authController.register
);
// router.route("/login").post(authController.login);

router.route("/verify-email").post(authController.verifyEmail);

module.exports = router;
