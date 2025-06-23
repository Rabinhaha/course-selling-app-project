const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_User_Password } = require("../config.js");

const userRouter = Router();
const { userModel } = require("../db");
// const { userMiddleware } = require("./middleware/user.js");

console.log("JWT_User_Password:", JWT_User_Password);
console.log("userModel:", userModel);

// ✅ Signup route
userRouter.post("/signup", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.status(201).json({
      message: "Signup successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
      error: error.message,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_User_Password,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      message: "Signin successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Signin failed",
      error: error.message,
    });
  }
});

// Optional: test route
userRouter.get("/purchase", (req, res) => {
  res.json({
    message: "purchase endpoint",
  });
});

module.exports = {
  userRouter,
};
