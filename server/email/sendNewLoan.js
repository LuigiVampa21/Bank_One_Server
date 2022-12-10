const sendEmail = require("./sendEmail");

const sendNewTransaction = async ({
  name,
  loan,
  account,
  amount,
  email,
  verificationToken,
}) => {
  const confirmLn = `${process.env.ORIGIN_API}/new-loan/?token=${verificationToken}&lnid=${loan}`;

  const message = `<p> A new loan of $${amount} is waiting for your approval on the account ${account}.
  Please follow this link to validate: <a href="${confirmLn}">Confirm Loan</a></p>
  <p>If you did not requested any loan, please contact the support team immediately</p>
  <p>Thanks</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "New Loan Approval",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

module.exports = sendNewTransaction;
