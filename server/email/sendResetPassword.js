const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token }) => {
  const resetURL = `${process.env.ORIGIN_API}/reset-password/?token=${token}&email=${email}`;
  const message = `<p>Follow this link to reset your ${process.env.COMPANY_NAME} password for your ${email} account. <a href="${resetURL}">Reset Password</a></p>
  <p>Hurry up, this link will only be valid for 10 minutes.</p>
  <p>If you didn’t ask to reset your password, you can ignore this email.</p>
  <p>Best Regards</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello ${name},</h4>
    ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
