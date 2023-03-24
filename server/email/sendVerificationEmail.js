const sendEmail = require("./sendEmail");
const style = require('./css/style.js');
const capitalize = require('../utils/capitalize');

const sendVerificationEmail = async (name, email, verificationToken) => {
  const verifyEmail = `${process.env.ORIGIN_API}/verify-email/?token=${verificationToken}&email=${email}`;
  const nameC = capitalize(name);
  const message = `  
  ${style}
  <main>
  <h4 class="title">Hello ${nameC}</h4> 
  <p class="main_content">Please follow this link to verify your email address: </p>
  <button><a href="${verifyEmail}" target="_blank">Verify Email</a></button>
  <p class="down_content">If this message does not show up properly, please contact support</p>
  <p class="last_content">Best Regards</p>
  <p class="company_name">${process.env.COMPANY_NAME}</p>
  </main>
  `;


  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: message,
  });
};

module.exports = sendVerificationEmail;
