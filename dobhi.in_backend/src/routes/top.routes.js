const express = require("express");
const { getTopOrderedServices } = require("../controllers/top.controller");
const authGuard = require("../middlewares/authGuard");
const asyncHandler = require("../middlewares/asyncHandler");
const requireDb = require("../middlewares/requireDb");

const router = express.Router();

router.get("/services", requireDb, authGuard("admin"), asyncHandler(getTopOrderedServices));

module.exports = router;
