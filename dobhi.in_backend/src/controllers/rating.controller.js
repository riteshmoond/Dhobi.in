const mongoose = require("mongoose");

const Rating = require("../models/rating.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { TRACKING_STEPS } = require("../utils/constants");

const mapRating = (rating) => ({
  id: String(rating._id),
  customerName: rating.customerName,
  customerId: String(rating.customer),
  orderId: rating.orderId,
  rating: rating.rating,
  review: rating.review,
  date: rating.date,
  createdAt: rating.createdAt,
  updatedAt: rating.updatedAt,
});

const createRating = async (req, res) => {
  const userId = req.user?.sub;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json(errorResponse("Unauthorized"));
  }

  const ratingValue = Number(req.body?.rating);
  const orderId = Number(req.body?.orderId);
  const review = String(req.body?.review || "").trim();

  if (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5) {
    return res.status(400).json(errorResponse("Rating must be between 1 and 5"));
  }

  if (!Number.isFinite(orderId)) {
    return res.status(400).json(errorResponse("Valid orderId is required"));
  }

  const deliveredStep = TRACKING_STEPS.length - 1;
  const order = await Order.findOne({ orderId, customer: userId }).select(
    "orderId customer trackingStep status"
  );

  if (!order) {
    return res
      .status(404)
      .json(errorResponse("Order not found for this customer"));
  }

  if (Number(order.trackingStep) < deliveredStep) {
    return res
      .status(400)
      .json(errorResponse("You can review only delivered orders"));
  }

  const existing = await Rating.findOne({ customer: userId, orderId }).select("_id");
  if (existing) {
    return res
      .status(409)
      .json(errorResponse("You have already submitted a review for this order"));
  }

  const user = await User.findById(userId).select("fullName");

  let created;
  try {
    created = await Rating.create({
      customer: userId,
      customerName: user?.fullName || "Customer",
      orderId,
      rating: ratingValue,
      review,
      date: new Date(),
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res
        .status(409)
        .json(errorResponse("You have already submitted a review for this order"));
    }
    throw error;
  }

  return res.status(201).json(successResponse({ rating: mapRating(created) }));
};

const getAdminRatings = async (req, res) => {
  const ratings = await Rating.find().sort({ createdAt: -1 });
  return res.status(200).json(successResponse({ ratings: ratings.map(mapRating) }));
};

const deleteRating = async (req, res) => {
  const id = String(req.params.id || "");
  const deleted = await Rating.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json(errorResponse("Rating not found"));
  }

  return res.status(200).json(successResponse({ id }, "Rating deleted"));
};

module.exports = {
  createRating,
  getAdminRatings,
  deleteRating,
};
