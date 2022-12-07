const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction.controller");

router
  .route("/")
  .get(transactionController.getAllTx)
  .post(transactionController.createNewTx);

router
  .route("/:id")
  .get(transactionController.getSingleTx)
  // .patch(transactionController.modifyTx);

module.exports = router;
