const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Read Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing or invalid",
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // 5️⃣ Attach user to request
    req.user = user;

    // 6️⃣ Continue to controller
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
