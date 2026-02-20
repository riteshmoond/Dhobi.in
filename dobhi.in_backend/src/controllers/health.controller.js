const { successResponse } = require("../utils/apiResponse");

const getHealth = (req, res) => {
  return res.status(200).json(
    successResponse({
      status: "ok",
      service: "dobhi.in_backend",
      timestamp: new Date().toISOString(),
    })
  );
};

module.exports = { getHealth };
