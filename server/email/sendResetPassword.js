const sendEmail = require("./sendEmail");
const style = require('./css/style.js');
const capitalize = require('../utils/capitalize');

const sendResetPasswordEmail = async ({ name, email, token }) => {
  const resetURL = `${process.env.ORIGIN_WS}/reset-password/?token=${token}&email=${email}`;
  const nameC = capitalize(name);
  const message = `
  ${style}
  <h4 class="title">Hello ${nameC},</h4>
  <p class="main_content">Follow this link to reset your ${process.env.COMPANY_NAME} password for your ${email} account. </p>
  <button><a href="${resetURL}" target="_blank">Reset Password</a> </button>
  <p class="down_content">Hurry up, this link will only be valid for 10 minutes.</p>
  <p class="down_content">If you didn’t ask to reset your password, you can ignore this email.</p>
  <p class="last_content">Best Regards</p>
  <p class="company_name">${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: message,
  });
};

module.exports = sendResetPasswordEmail;
