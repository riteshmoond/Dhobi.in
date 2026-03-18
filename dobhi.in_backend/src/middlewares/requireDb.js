const { isDbAvailable, getDbUnavailableReason } = require("../config/db");

const requireDb = (req, res, next) => {
  if (isDbAvailable()) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: "Database unavailable",
    reason: getDbUnavailableReason() || "Database connection not established",
  });
};

module.exports = requireDb;
