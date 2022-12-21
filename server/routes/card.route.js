const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const cardController = require("../controllers/card.controller");

router
  .route("/")
//   .get(cardController.getAllCards)
     .post(authMiddleware.checkToken, cardController.createCard)


router.route('/user').get(authMiddleware.checkToken, cardController.getAllUserCards)

router.route("/:id").patch(
  authMiddleware.checkToken, 
  cardController.updateCardInsurances);


module.exports = router;
