const sendEmail = require("./sendEmail");

const sendDeleteUserAccount = async (user, verificationToken) => {
  const verifyEmail = `${process.env.ORIGIN_API}/delete-account/?token=${verificationToken}&email=${user.email}`;

  const message = `<p>By clicking this link you authorize us to close your account: ${user.id} and disable all remaining bank accounts and cards: <a href="${verifyEmail}">Verify Email</a></p>
  <p>Delete your account</p>
  <p>In accordance with the legislation we still have to keep your informations available for 5years after the date of removal.</p>
  <p>Please prior to delete your account, be sure there are no funds left on any accounts and no transaction processing at this time </p>
  <p>If you did not requested any account deletion, please contact the support team immediately</p>
  <p>Best Regards</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "Deleting Your Account",
    html: `<h4>Hello ${user.name}</h4> ${message}`,
  });
};

module.exports = sendDeleteUserAccount;
