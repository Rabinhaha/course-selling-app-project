const jwt = require("jsonwebtoken");
const { JWT_Admin_Password } = require("../config");

function AdminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decode = jwt.verify(token, JWT_Admin_Password);
    req.userId = decode.id || decode.Id; // adjust key as per your payload
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Signin failed", error: error.message });
  }
}

module.exports = {
  AdminMiddleware,
};
