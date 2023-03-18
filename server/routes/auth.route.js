const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require('../middlewares/authMiddleware')
// const multerMiddleware = require("../utils/multer");


//                           ORIGIN ROUTES


router.route("/register").post(
  // multerMiddleware.multerM,
  authController.register
);

router.route("/login").post(authController.login);
router.route("/logout").get(authMiddleware.checkToken, authController.logout);


//                           EMAIL ROUTES


router.route("/verify-email").get(authController.verifyEmail);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password").post(authController.resetPassword);
router.route("/new-transaction").get(authController.confirmTx);
router.route("/new-loan").get(authController.approveLoan);
router.route("/insurances-approval").get(authController.approveInsurance);
router.route("/card-approval").get(authController.approveCard);
router.route("/delete-account").get(authController.deleteAccount);

module.exports = router;
