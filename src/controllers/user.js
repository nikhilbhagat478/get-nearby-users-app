const utils = require("../utils/utils");
const auth = require("../middlewares/auth");
const fs = require("fs");
const dbUtils = require("../utils/dbUtils");
const User = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(utils.sendResponse(true, users));
  } catch (error) {
    return res
      .status(400)
      .json(utils.sendResponse(false, error?.message || error));
  }
};

const signupUser = async (req, res) => {
  try {
    let body = req.body;
    const locationObj = {
      type: body["location[type]"],
      coordinates: JSON.parse(body["location[coordinates]"]),
    };
    delete body["location[type]"];
    delete body["location[coordinates]"];
    body = { ...body, location: locationObj };
    const ifExistingUser = await dbUtils.checkIfUserExistsByEmail(body.email);
    if (ifExistingUser) throw "User Already Exist";
    const files = req.files;
    if (files && files.profilePic) {
      let uploadedFile = files.profilePic;
      let exploded_name = uploadedFile.name.split(".");
      let ext = exploded_name[exploded_name.length - 1];
      let fileName = exploded_name[0] + "@" + Date.now() + "." + ext;
      uploadedFile.mv(`public/${fileName}`, (err) => {
        if (err) console.log(err);
      });
      body.profilePic = fileName;
    }
    body.password = await utils.getBecryptedPassword(body.password);
    const user = await User.create(body);
    const token = auth.getJwtToken(user._id);
    return res.status(200).json(utils.sendResponse(true, token));
  } catch (error) {
    return res
      .status(400)
      .json(utils.sendResponse(false, error?.message || error));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbUtils.getUserByEmailPassword(email, password);
    if (!user) throw "Inavlid Credentials";
    const token = auth.getJwtToken(user._id);
    const response = { ...user, token };
    return res.status(200).json(utils.sendResponse(true, response));
  } catch (error) {
    return res
      .status(400)
      .json(utils.sendResponse(false, error?.message || error));
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    return res.status(200).json(utils.sendResponse(true, user));
  } catch (error) {
    return res
      .status(400)
      .json(utils.sendResponse(false, error?.message || error));
  }
};

const updateUser = async (req, res) => {
  try {
    const { body, userId, user, files } = req;
    if (files && files.profilePic) {
      if (user.profilePic) {
        fs.unlink(`public/${user.profilePic}`, (err) => {
          if (err) throw err;
        });
      }
      let uploadedFile = files.profilePic;
      let exploded_name = uploadedFile.name.split(".");
      let ext = exploded_name[exploded_name.length - 1];
      let fileName = exploded_name[0] + "@" + Date.now() + "." + ext;
      uploadedFile.mv(`public/${fileName}`, (err) => {
        if (err) console.log(err);
      });
      body.profilePic = fileName;
    }
    if (body.password) {
      body.password = await utils.getBecryptedPassword(body.password);
    }
    const updatedUser = await User.findByIdAndUpdate(userId, body, {
      new: true,
    });
    return res.status(200).json(utils.sendResponse(true, updatedUser));
  } catch (error) {
    return res
      .status(400)
      .json(utils.sendResponse(false, error?.message || error));
  }
};

const getNearByUsers = async (req, res) => {
  try {
    const { user, userId } = req;
    // MongoDB uses [longitude, latitude] sequence
    const nearbyUsers = await User.find({
      _id: { $ne: userId },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: user.location.coordinates,
          },
          $maxDistance: 1000000, // Maximum distance in meters (adjust as needed)
        },
      },
    });
    return res.status(200).json(utils.sendResponse(true, nearbyUsers));
  } catch (error) {
    return res
      .status(400)
      .json(utils.sendResponse(false, error?.message || error));
  }
};

const removeUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);
    if (user.profilePic) {
      fs.unlink(`public/${user.profilePic}`, (err) => {
        if (err) throw err;
        // console.log("profile pic removed.");
      });
    }
    return res
      .status(200)
      .json(utils.sendResponse(true, "User Deleted Successfully."));
  } catch (error) {
    return res
      .status(400)
      .json(utils.sendResponse(false, error?.message || error));
  }
};

module.exports = {
  getAllUsers,
  signupUser,
  removeUser,
  loginUser,
  getUser,
  updateUser,
  getNearByUsers,
};
