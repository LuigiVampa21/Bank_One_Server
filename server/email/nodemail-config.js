// module.exports = {
//   host: process.env.NODEMAILER_HOST,
//   port: process.env.NODEMAILER_PORT,
//   auth: {
//     user: process.env.NODEMAILER_USER,
//     pass: process.env.NODEMAILER_PASS,
//   },
// };

module.exports = {
    service: process.env.NODEMAILER_SERVICE_G,
    auth: {
      user: process.env.NODEMAILER_USER_G,
      pass: process.env.NODEMAILER_PASSWORD_G
    }
}
