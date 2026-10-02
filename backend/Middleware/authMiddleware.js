const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "A bearer token is required" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  try {
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    req.userId = user._id;
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Authentication could not be completed" });
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
