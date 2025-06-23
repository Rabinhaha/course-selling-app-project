const jwt = require("jsonwebtoken");
const { JWT_User_Password } = require("../config");

function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // typical header key is "authorization"
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decode = jwt.verify(token, JWT_User_Password);

    req.userId = decode.id || decode.Id; // adjust based on your token payload key

    next(); // proceed to next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: "Signin failed", error: error.message });
  }
}

module.exports = {
  userMiddleware,
};
