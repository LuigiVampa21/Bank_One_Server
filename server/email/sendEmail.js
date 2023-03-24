const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemail-config");

const sendEmail = async ({ to, subject, html }) => {

  // let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport(nodemailerConfig);


  return transporter.sendMail({
    from: `${process.env.COMPANY_NAME} bankone@corporation.com`,
    // from: 'bankone@corporation.com',
    to,
    subject,
    html,
  }, function(error,info){
    if(error){
      console.log(error);
    }else{
      console.log(info);
    }
  });
};

module.exports = sendEmail;
