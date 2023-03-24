const sendEmail = require("./sendEmail");
const style = require('./css/style.js');
const capitalize = require('../utils/capitalize');

const sendNewTransaction = async ({
  name,
  transaction,
  amount,
  email,
  verificationToken,
  beneficiary,
}) => {
  const confirmTx = `${process.env.ORIGIN_API}/new-transaction/?token=${verificationToken}&txid=${transaction}`;
  const nameC = capitalize(name);
  const message = `
  ${style}
  <h4 class="title">Hello ${nameC}</h4>
  <p class="main_content"> A new transaction of $${amount} has been requested to ${beneficiary}.</p> 
  <p class="main_content"> Please follow this link to validate:</p> 
  <button> <a href="${confirmTx}" target="_blank">Confirm Transaction</a> </button>
  <p class="down_content">If you did not requested any transaction, please contact the support team immediately</p>
  <p class="last_content">Best Regards</p>
  <p class="company_name">${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "New Transaction Requested",
    html: message,
  });
};

module.exports = sendNewTransaction;
