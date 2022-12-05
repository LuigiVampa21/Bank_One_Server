const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token }) => {
  const resetURL = `${process.env.ORIGIN_WS}/reset-password/${token}?email=${email}`;
  const message = `<p>Follow this link to reset your Adelfos_client password for your ${email} account. <a href="${resetURL}">Reset Password</a></p>
  <p>If you didn’t ask to reset your password, you can ignore this email.</p>
  <p>Thanks</p>
  <p>Adelfos_CREW</p>
  `;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello ${name},</h4>
    ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
