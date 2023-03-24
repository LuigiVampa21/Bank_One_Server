const sendEmail = require("./sendEmail");
const style = require('./css/style.js');
const capitalize = require('../utils/capitalize');

const sendDeleteUserAccount = async (user, verificationToken) => {
  const verifyEmail = `${process.env.ORIGIN_API}/delete-account/?token=${verificationToken}&email=${user.email}`;
  const nameC = capitalize(user.name);
  const message = `
  ${style}
  <h4 class="title">Hello ${nameC}</h4> 
  <p class="main_content">By clicking this link you authorize us to close your account: ${user.id} and disable all remaining bank accounts and cards: </p>
  <button><a href="${verifyEmail}" target="_blank">Delete your account</a></button>
  <p class="down_content">In accordance with the legislation we still have to keep your informations available for 5 years after the date of removal.</p>
  <p class="down_content">Please prior to delete your account, be sure there are no funds left on any accounts and no transaction processing at this time </p>
  <p class="down_content">If you did not requested any account deletion, please contact the support team immediately</p>
  <p class="last_content">Best Regards</p>
  <p class="company_name">${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: user.email,
    subject: "Deleting Your Account",
    html: message,
  });
};

module.exports = sendDeleteUserAccount;
