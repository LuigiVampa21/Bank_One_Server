const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const cardController = require("../controllers/card.controller");

router
  .route("/")
//   .get(cardController.getAllCards)
     .post(authMiddleware.checkToken, cardController.createCard)


router.route('/user').get(authMiddleware.checkToken, cardController.getAllUserCards)
router.route('/secondCard').post(authMiddleware.checkToken, cardController.applyForSecondCard)

router.route("/:id").patch(
  authMiddleware.checkToken, 
  cardController.updateCardInsurances);

  
  
  
  // DEV PURPOSES
  
  const addInsurancesOnCards = require('../utils/addInsurancesOnCards');
  const Card = require("../models/card.model");
  
  router.route('/insurance').post(async (req,res) => {
    const cards = await addInsurancesOnCards('a58f1175-bf38-483a-a42f-35ccf3b60cc4')
    res.status(200).json({
      cards
    })
  })
  
  router.route("/:id").delete(async(req,res) => {
    const card = await Card.findByPk(req.params.id)
    await card.destroy({force: true});
    res.status(204).json({
      msg: 'deleted'
    })
  }

   );


module.exports = router;
