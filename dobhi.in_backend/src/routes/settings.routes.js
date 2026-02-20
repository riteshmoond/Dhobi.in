const express = require("express");

const asyncHandler = require("../middlewares/asyncHandler");
const authGuard = require("../middlewares/authGuard");
const validateRequest = require("../middlewares/validateRequest");
const { getSettings, updateSettings } = require("../controllers/settings.controller");
const { updateSettingsSchema } = require("../validators/requestSchemas");

const router = express.Router();

router.get("/", asyncHandler(getSettings));
router.put(
  "/",
  authGuard("admin"),
  validateRequest(updateSettingsSchema),
  asyncHandler(updateSettings)
);

module.exports = router;
