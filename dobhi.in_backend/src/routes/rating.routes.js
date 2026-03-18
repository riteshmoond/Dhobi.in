const express = require("express");

const asyncHandler = require("../middlewares/asyncHandler");
const authGuard = require("../middlewares/authGuard");
const requireDb = require("../middlewares/requireDb");
const validateRequest = require("../middlewares/validateRequest");
const {
  createRating,
  getAdminRatings,
  deleteRating,
} = require("../controllers/rating.controller");
const { createRatingSchema } = require("../validators/requestSchemas");

const router = express.Router();

router.use(requireDb);

router.post("/", authGuard(), validateRequest(createRatingSchema), asyncHandler(createRating));
router.get("/admin/all", authGuard("admin"), asyncHandler(getAdminRatings));
router.delete("/admin/:id", authGuard("admin"), asyncHandler(deleteRating));

module.exports = router;
