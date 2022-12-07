const sendEmail = require("./sendEmail");

const sendNewTransaction = async ({
  name,
  amount,
  email,
  verificationToken,
  beneficiary,
}) => {
  console.log(
    "--------------------------------------------------------------------------------------"
  );
  console.log(email);
  console.log(
    "--------------------------------------------------------------------------------------"
  );
  const confirmTx = `${process.env.ORIGIN_API}/verify-email/?token=${verificationToken}&email=${email}`;

  const message = `<p> A new transaction of $${amount} has been requested to ${beneficiary}.
  Please follow this link to validate: <a href="${confirmTx}">Confirm Transaction</a></p>
  <p>If you did not requested for any transaction, please contact the support team immediately</p>
  <p>Thanks</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "New Transaction Requested",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

module.exports = sendNewTransaction;
