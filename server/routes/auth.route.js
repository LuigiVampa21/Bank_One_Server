const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
// const multerMiddleware = require("../utils/multer");

router.route("/register").post(
  // multerMiddleware.multerM,
  authController.register
);
router.route("/login").post(authController.login);
router.route("/verify-email").post(authController.verifyEmail);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password").post(authController.resetPassword);

module.exports = router;
