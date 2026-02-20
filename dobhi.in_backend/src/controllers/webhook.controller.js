const Razorpay = require('razorpay');
const { successResponse, errorResponse } = require("../utils/apiResponse");

// Webhook handler for Razorpay payment verification
async function razorpayWebhook(req, res) {
  // Razorpay sends POST with event and payload
  const event = req.body.event;
  const payload = req.body.payload;

  // For production, verify signature here (req.headers['x-razorpay-signature'])
  // For demo, just log and respond
  if (!event) {
    return res.status(400).json(errorResponse("Missing event type"));
  }

  // TODO: Update order status/paymentInfo in DB based on event
  // Example: payment.captured, payment.failed, order.paid

  console.log("Razorpay webhook event:", event, payload);

  return res.status(200).json(successResponse({ received: true, event }));
}

module.exports = { razorpayWebhook };
