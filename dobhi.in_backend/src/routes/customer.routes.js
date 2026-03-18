const express = require("express");

const asyncHandler = require("../middlewares/asyncHandler");
const authGuard = require("../middlewares/authGuard");
const requireDb = require("../middlewares/requireDb");
const { getCustomers } = require("../controllers/customer.controller");

const router = express.Router();

router.use(requireDb);

router.get("/", authGuard("admin"), asyncHandler(getCustomers));

module.exports = router;
