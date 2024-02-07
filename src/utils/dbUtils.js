const User = require("../models/user");
const utils = require("./utils");
const bcrypt = require("bcrypt");

exports.checkIfUserExistsByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.getUserByEmailPassword = async (email, password) => {
  const user = utils.getClone(await User.findOne({ email }));
  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }
  return null;
};

exports.getUserById = async (id) => {
  return await User.findById(id);
};
