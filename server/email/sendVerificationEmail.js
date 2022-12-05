const sendEmail = require("./sendEmail");

const sendVerificationEmail = async (name, email, verificationToken) => {
  const verifyEmail = `${process.env.ORIGIN_WS}/verify-email/?token=${verificationToken}&email=${email}`;

  const message = `<p>Please follow this link to verify your email address: <a href="${verifyEmail}">Verify Email</a></p>
  <p>Follow this link to verify your email address</p>
  <p>Thanks</p>
  <p>Adelfos_CREW</p>
  `;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

module.exports = sendVerificationEmail;
