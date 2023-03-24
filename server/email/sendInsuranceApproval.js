const sendEmail = require("./sendEmail");
const style = require('./css/style.js');
const capitalize = require('../utils/capitalize');

const sendInsuranceApproval = async ({
  name,
  accountID,
  email,
  verificationToken,
}) => {
  const approvalLink = `${process.env.ORIGIN_API}/insurances-approval/?token=${verificationToken}&acc=${accountID}`;
  const nameC = capitalize(name);
  const message = `
  ${style}
  <h4 class="title">Hello ${nameC}</h4> 
  <p class="main_content">You want to add insurances on all your cards. Nothing easier !</p>
  <p class="main_content">Please follow this link to approve:</p> 
  <button><a href="${approvalLink}" target="_blank">Approve</a></button>
  <p class="down_content">If you did not requested for that, please contact the support team</p>
  <p class="last_content">Best Regards</p>
  <p class="company_name">${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "Approve Insurance Terms ",
    html: message,
  });
};

module.exports = sendInsuranceApproval;
