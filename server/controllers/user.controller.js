const { Sequelize } = require("sequelize");
const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    // include: [Address, ShoppingCart],
  });
  res.status(200).json({
    results: users.length,
    users,
  });
};

exports.getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  res.status(200).json({
    user,
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const user = await User.findByPk(id);
  //   await user.update({
  //     firstName,
  //     lastName,
  //     email,
  //   });
  res.status(200).json({
    user,
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  await user.destroy();
  res.status(204).json({
    msg: null,
  });
};
