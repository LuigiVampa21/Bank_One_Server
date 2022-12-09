const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const loanController = require("../controllers/loan.controller");


router.route("/").post(
//   authMiddleware.checkToken,
  loanController.createNewLoan
);

module.exports = router;
