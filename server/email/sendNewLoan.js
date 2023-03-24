const sendEmail = require("./sendEmail");
const style = require('./css/style.js');
const capitalize = require('../utils/capitalize');

const sendNewTransaction = async ({
  name,
  loan,
  account,
  amount,
  email,
  verificationToken,
}) => {
  const confirmLn = `${process.env.ORIGIN_API}/new-loan/?token=${verificationToken}&lnid=${loan}`;
  const nameC = capitalize(name);
  const message = `
  ${style}
  <h4 class="title">Hello ${nameC}</h4>
  <p class="main_content"> A new loan of $${amount} is waiting for your approval on the account ${account}.</p>
  <p class="main_content"> Please follow this link to validate: </p>
  <button><a href="${confirmLn}" target="_blank">Confirm Loan</a></button>
  <p class="down_content">If you did not requested any loan, please contact the support team immediately</p>
  <p class="last_content">Best Regards</p>
  <p class="company_name">${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "New Loan Approval",
    html: message,
  });
};

module.exports = sendNewTransaction;
