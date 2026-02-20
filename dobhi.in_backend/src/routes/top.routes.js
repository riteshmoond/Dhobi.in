const express = require("express");
const { getTopOrderedServices } = require("../controllers/top.controller");
const authGuard = require("../middlewares/authGuard");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

router.get("/services", authGuard("admin"), asyncHandler(getTopOrderedServices));

module.exports = router;
