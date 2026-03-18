const { successResponse } = require("../utils/apiResponse");
const { getDbMode, getDbUnavailableReason, isDbAvailable } = require("../config/db");

const getHealth = (req, res) => {
  return res.status(200).json(
    successResponse({
      status: "ok",
      service: "dobhi.in_backend",
      database: {
        available: isDbAvailable(),
        mode: getDbMode(),
        reason: getDbUnavailableReason() || null,
      },
      timestamp: new Date().toISOString(),
    })
  );
};

module.exports = { getHealth };
