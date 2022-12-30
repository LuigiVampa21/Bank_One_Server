const sendEmail = require("./sendEmail");

const sendNewTransaction = async ({
  name,
  transaction,
  amount,
  email,
  verificationToken,
  beneficiary,
}) => {
  const confirmTx = `${process.env.ORIGIN_API}/new-transaction/?token=${verificationToken}&txid=${transaction}`;

  const message = `<p> A new transaction of $${amount} has been requested to ${beneficiary}.
  Please follow this link to validate: <a href="${confirmTx}">Confirm Transaction</a></p>
  <p>If you did not requested any transaction, please contact the support team immediately</p>
  <p>Best Regards</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "New Transaction Requested",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

module.exports = sendNewTransaction;
