const sendEmail = require("./sendEmail");

const sendInsuranceApproval = async ({
  name,
  accountID,
  email,
  verificationToken,
}) => {
  const approvalLink = `${process.env.ORIGIN_API}/insurances-approval/?token=${verificationToken}&acc=${accountID}`;

  const message = `<p> You want to add insurances on all your cards. Nothing easier !
  Please follow this link to approve: <a href="${approvalLink}">Approve</a></p>
  <p>If you did not requested for that, please contact the support team</p>
  <p>Thanks</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "Approve Insurance Terms ",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

module.exports = sendInsuranceApproval;
