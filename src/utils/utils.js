const bcrypt = require("bcrypt");

exports.checkMissingFields = (checkObj, requiredFields) => {
  if (typeof requiredFields == "string")
    requiredFields = requiredFields.split(",");
  let missingField;
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in checkObj)) {
      missingField = field;
      return { success: true, missingField };
    }
  }
  return { success: false };
};

exports.sendResponse = (status, response) => {
  return { status, response };
};

exports.getBecryptedPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.getClone = (obj) => {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (err) {
    console.log(err);
  }
};
