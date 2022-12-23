const express = require("express");
const router = express.Router();
const queryMiddleware = require("../middlewares/queryMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const transactionController = require("../controllers/transaction.controller");

router
  .route("/")
  .get(transactionController.getAllTx)
  .post(authMiddleware.checkToken, transactionController.createNewTx);

router
  .route('/user')
  .get(authMiddleware.checkToken, transactionController.getAllUserTxs)

router
  .route("/documents")
  .get(
    authMiddleware.checkToken,
    queryMiddleware.customQuery,
    transactionController.searchDocs
  );

router.route("/:id").get(transactionController.getSingleTx);
// if status tx is still pending
// .patch(transactionController.modifyTx);

module.exports = router;
