const express = require("express");
const router = express.Router();
const queryMiddleware = require("../middlewares/queryMiddleware");

const transactionController = require("../controllers/transaction.controller");

router
  .route("/")
  .get(transactionController.getAllTx)
  .post(transactionController.createNewTx);

router
  .route("/documents")
  .get(queryMiddleware.customQuery, transactionController.searchDocs);

router.route("/:id").get(transactionController.getSingleTx);
// .patch(transactionController.modifyTx);

module.exports = router;
