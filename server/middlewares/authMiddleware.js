const jwt = require("jsonwebtoken");
const CustomError = require("../errors/index");

exports.checkToken = async (req, res, next) => {
  const token = await req.headers.authorization.split(" ")[1];
  if (!token)
    throw new CustomError.UnauthenticatedError(
      "Sorry you are not authorized to access this route"
    );
  if (!jwt.verify(token, process.env.JWT_SECRET)) {
    throw new CustomError.UnauthenticatedError(
      "Sorry your token is not valid anymore"
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { id } = decoded;
  req.user = id;
  next();
};
