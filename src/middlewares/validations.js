const { checkMissingFields, sendResponse } = require("../utils/utils");

exports.signup = (req, res, next) => {
  const body = req.body;
  if (!body) {
    res.status(400).json(sendResponse(false, `required data missing`));
  }
  const checkFields = checkMissingFields(body, "email,password,mobile,zipCode");
  if (checkFields.success) {
    return res
      .status(400)
      .json(sendResponse(false, `${checkFields.missingField} missing`));
  }
  next();
};

exports.login = (req, res, next) => {
  const body = req.body;
  const checkFields = checkMissingFields(body, "email,password");
  if (checkFields.success) {
    res
      .status(400)
      .json(sendResponse(false, `${checkFields.missingField} missing`));
  }
  next();
};
