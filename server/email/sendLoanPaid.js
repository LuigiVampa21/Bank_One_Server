const sendEmail = require("./sendEmail");

const sendLoanPaid = async (name, email, loanID) => {

  const message = `<p>You just paid your loan: ${loanID} entirely !!></p>
  <p>Being free from debt is an important step in life, and we are proud you managed to get here!</p>
  <p>Best Regards</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "You fully reimbursed your loan",
    html: `<h4>Congratulations ${name} !</h4> ${message}`,
  });
};

module.exports = sendLoanPaid;
