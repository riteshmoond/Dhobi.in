const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const authGuard = require("../middlewares/authGuard");
const { createRazorpayOrder } = require("../services/razorpay");

const router = express.Router();

// POST /api/payment/razorpay/order
router.post("/razorpay/order", authGuard(), asyncHandler(async (req, res) => {
  const { amount, currency, receipt } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }
  const order = await createRazorpayOrder(amount, currency || 'INR', receipt || undefined);
  res.json({ success: true, order });
}));

module.exports = router;
