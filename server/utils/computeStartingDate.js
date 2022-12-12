const moment = require("moment");

exports.startDate = () => {
  const startDate = moment().add(1, "month").date(5);
  return new Date(startDate);
};
