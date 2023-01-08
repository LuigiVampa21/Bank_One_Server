const sendEmail = require("./sendEmail");

const sendVerificationEmail = async (name, email, verificationToken) => {
  const verifyEmail = `${process.env.ORIGIN_API}/verify-email/?token=${verificationToken}&email=${email}`;

  const message = `<p>Please follow this link to verify your email address: <a href="${verifyEmail}" target="_blank">Verify Email</a></p>
  <p>Follow this link to verify your email address</p>
  <p>Best Regards</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

module.exports = sendVerificationEmail;
