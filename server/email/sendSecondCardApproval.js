const sendEmail = require("./sendEmail");

const sendSecondCardApproval = async ({
  name,
  cardID,
  email,
  verificationToken,
}) => {
  const approvalLink = `${process.env.ORIGIN_API}/card-approval/?token=${verificationToken}&card=${cardID}`;

  const message = `<p> You want to add a physical card to your wallet. Nothing easier !
  Please follow this link to approve: <a href="${approvalLink}" target="_blank">Approve</a></p>
  <p>If you did not requested for that, please contact the support team</p>
  <p>Best Regards</p>
  <p>${process.env.COMPANY_NAME}</p>
  `;

  return sendEmail({
    to: email,
    subject: "Approve Physical Card Request",
    html: `<h4>Hello ${name}</h4> ${message}`,
  });
};

module.exports = sendSecondCardApproval;
