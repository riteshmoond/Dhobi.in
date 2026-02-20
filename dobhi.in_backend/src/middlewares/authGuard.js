const jwt = require("jsonwebtoken");

const env = require("../config/env");

const authGuard = (requiredRole) => (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload;

    if (requiredRole && payload.role !== requiredRole) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    return next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authGuard;
