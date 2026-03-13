const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Bad Request! Token is required" });
    }

    token = token.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid Token", error: err.message });
      }

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user;      
      req.userId = user._id;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: No Token Provided" });
  }
};

const checkRole = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admin role required" });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return next();
    }

    token = token.split(" ")[1];
    if (!token) {
      return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return next();
      }

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return next();
      }

      req.user = user;
      req.userId = user._id;
      next();
    });
  } catch (error) {
    next();
  }
};

module.exports = {
  auth,
  checkRole,
  optionalAuth,
};
