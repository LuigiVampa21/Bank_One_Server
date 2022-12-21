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



// DEV PURPOSES

const addInsurancesOnCards = require('../utils/addInsurancesOnCards')

router.route('/insurance').post(async (req,res) => {
  const cards = await addInsurancesOnCards('a58f1175-bf38-483a-a42f-35ccf3b60cc4')
  res.status(200).json({
    cards
  })
})

module.exports = router;
