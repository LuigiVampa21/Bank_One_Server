const sendEmail = require("./sendEmail");
const style = require('./css/style.js');
const capitalize = require('../utils/capitalize');

const sendLoanPaid = async (name, email, loanID) => {
  const nameC = capitalize(name);
  const message = `
  ${style}
  <h4 class="title">Congratulations ${nameC} !</h4> 
  <p class="main_content">You just paid your loan: ${loanID} entirely !!></p>
  <p class="down_content">Being free from debt is an important step in life, and we are proud you managed to get here!</p>
  <p class="last_content">Best Regards</p>
  <p class="company_name">${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "You fully reimbursed your loan",
    html: message,
  });
};

module.exports = sendLoanPaid;
