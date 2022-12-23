const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const authMiddleware = require('../middlewares/authMiddleware')
// const multerMiddleware = require("../utils/multer");

router.route("/").get(userController.getAllUsers);

router.route('/overview').get(authMiddleware.checkToken,userController.getOverview);
router.route('/accounts').get(authMiddleware.checkToken,userController.getUserAccounts);

router
  .route("/:id")
  .get(userController.getSingleUser)
  .patch(
    // multerMiddleware.multerM,
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;


