const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middlewares/authMiddleware')
// const multerMiddleware = require("../utils/multer");

router.route("/register").post(
  // multerMiddleware.multerM,
  authController.register
);
router.route("/login").post(authController.login);
router.route("/logout").get(authMiddleware.checkToken, authController.logout);
router.route("/verify-email").get(authController.verifyEmail);
router.route("/forgot-password").get(authController.forgotPassword);
router.route("/reset-password").post(authController.resetPassword);
router.route("/new-transaction").get(authController.confirmTx);
router.route("/new-loan").get(authController.approveLoan);

module.exports = router;
