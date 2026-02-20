const express = require("express");
const { razorpayWebhook } = require("../controllers/webhook.controller");
const router = express.Router();

// Razorpay webhook endpoint (no auth)
router.post("/razorpay", express.json({ type: "application/json" }), razorpayWebhook);

module.exports = router;
