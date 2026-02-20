const express = require("express");

const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const serviceRoutes = require("./service.routes");
const settingsRoutes = require("./settings.routes");
const orderRoutes = require("./order.routes");
const ratingRoutes = require("./rating.routes");
const customerRoutes = require("./customer.routes");
const paymentRoutes = require("./payment.routes");
const topRoutes = require("./top.routes");
const webhookRoutes = require("./webhook.routes");
const contactRoutes = require("./contact.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/services", serviceRoutes);
router.use("/settings", settingsRoutes);
router.use("/orders", orderRoutes);
router.use("/ratings", ratingRoutes);
router.use("/customers", customerRoutes);
router.use("/payment", paymentRoutes);
router.use("/top", topRoutes);
router.use("/webhook", webhookRoutes);
router.use("/contact", contactRoutes);

module.exports = router;
