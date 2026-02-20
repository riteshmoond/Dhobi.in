// Razorpay order creation service
const Razorpay = require("razorpay");

let razorpayClient = null;

const getRazorpayClient = () => {
  if (razorpayClient) return razorpayClient;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const err = new Error("Razorpay is not configured on server");
    err.statusCode = 503;
    throw err;
  }

  razorpayClient = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  return razorpayClient;
};

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in INR (Razorpay expects paise)
 * @param {string} currency - Currency code (default: 'INR')
 * @param {string} receipt - Unique receipt/order id
 * @returns {Promise<object>} Razorpay order object
 */
async function createRazorpayOrder(amount, currency = "INR", receipt = "") {
  const razorpay = getRazorpayClient();
  const options = {
    amount: Math.round(amount * 100), // convert to paise
    currency,
    receipt,
    payment_capture: 1,
  };
  return await razorpay.orders.create(options);
}

module.exports = {
  createRazorpayOrder,
};
