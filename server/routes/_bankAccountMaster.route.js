const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");

const BankAccount = require("../models/bankAccount.model");

// Creation Master Bank One Account

router.route("/").post(async (req, res) => {
  const masterBA = await BankAccount.create({
    iban: "LI 0000 0000 0000 0000",
    type: "Bank One Ltd.",
    is_active: true,
    amount: 1000000000,
    has_received_money_day: false,
  });
  res.status(200).json({
    masterBA,
  });
});

// Fill up MasterBA when reserves are running low = < $100'000'000

router.route("/fill").patch(async (req, res) => {
    const masterBA = await BankAccount.findOne({
      where: {
        [Op.and]: [
          { type: "Bank One Ltd." },
          { iban: "LI 0000 0000 0000 0000" }
        ],
      },
    },
    )


 const mbk = await masterBA.update({
      amount: 1000000000,
    });
    await mbk.save();

  res.status(200).json({
    data: mbk,
  });
});

module.exports = router;
