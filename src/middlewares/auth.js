const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_TOKEN_KEY;
const dbUtils = require("../utils/dbUtils");

exports.getJwtToken = (userId) => {
  const token = jwt.sign({ userId }, jwtSecretKey, {
    expiresIn: "24h",
  });
  return token;
};

exports.verifyToken = async (req, res, next) => {
  const headerToken = req.headers["authorization"];
  if (!headerToken) {
    return res.status(400).json({ success: false, message: "Token Required!" });
  }
  const bearerToken = headerToken.substring(7, headerToken.length);
  try {
    const decoded = jwt.verify(bearerToken, jwtSecretKey);
    const user = await dbUtils.getUserById(decoded.userId);
    req.user = user;
    req.userId = decoded.userId;
    return next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: error ?? "Invalid Token!" });
  }
};
