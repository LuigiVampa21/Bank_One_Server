const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
// const multerMiddleware = require("../utils/multer");

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getSingleUser)
  .patch(
    // multerMiddleware.multerM,
    userController.updateUser
  )
  .delete(userController.deleteUser);

module.exports = router;
