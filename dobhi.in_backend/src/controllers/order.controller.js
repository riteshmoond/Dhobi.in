const mongoose = require("mongoose");

const Order = require("../models/order.model");
const Settings = require("../models/settings.model");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { TRACKING_STEPS } = require("../utils/constants");

const mapOrder = (order) => ({
  id: order.orderId,
  items: order.items,
  subtotal: order.subtotal,
  deliveryCharge: order.deliveryCharge,
  rushDelivery: order.rushDelivery,
  rushDeliveryCharge: order.rushDeliveryCharge,
  total: order.total,
  trackingStep: order.trackingStep,
  status: order.status,
  address: order.address,
  paymentMethod: order.paymentMethod,
  paymentInfo: order.paymentInfo,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  customerId: String(order.customer),
});

const getSettings = async () => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
};

const getNextOrderId = async () => {
  let orderId = Date.now();
  let exists = await Order.findOne({ orderId }).select("_id");

  while (exists) {
    orderId += 1;
    exists = await Order.findOne({ orderId }).select("_id");
  }

  return orderId;
};

const createOrder = async (req, res) => {
  const userId = req.user?.sub;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json(errorResponse("Unauthorized"));
  }

  const body = req.body || {};
  const items = Array.isArray(body.items) ? body.items : [];
  const address = body.address || {};

  if (items.length === 0) {
    return res.status(400).json(errorResponse("Order items are required"));
  }

  const requiredAddressFields = ["fullName", "phone", "address", "city", "pincode"];
  const missing = requiredAddressFields.find((field) => !String(address[field] || "").trim());
  if (missing) {
    return res.status(400).json(errorResponse(`${missing} is required`));
  }

  const settings = await getSettings();
  if (settings.ordersEnabled === false) {
    return res.status(400).json(errorResponse("Orders are currently paused"));
  }

  const subtotal = Number(body.subtotal) || 0;
  const deliveryCharge = Number(body.deliveryCharge) || 0;
  const rushDeliveryCharge = Number(body.rushDeliveryCharge) || 0;
  const total = Number(body.total) || subtotal + deliveryCharge + rushDeliveryCharge;

  if (total < Number(settings.minOrderValue || 0)) {
    return res
      .status(400)
      .json(errorResponse(`Minimum order value is Rs ${settings.minOrderValue}`));
  }

  const paymentMethod = String(body.paymentMethod || "cod");
  if (!["cod", "upi", "card", "netbanking"].includes(paymentMethod)) {
    return res.status(400).json(errorResponse("Invalid payment method"));
  }

  const isEnabledMethod = settings.paymentMethods?.[paymentMethod] !== false;
  if (!isEnabledMethod) {
    return res.status(400).json(errorResponse("Selected payment method is unavailable"));
  }

  const order = await Order.create({
    orderId: await getNextOrderId(),
    customer: userId,
    items: items.map((item) => ({
      serviceCode: String(item.id || item.serviceCode || ""),
      name: String(item.name || ""),
      price: Number(item.price) || 0,
      qty: Number(item.qty) || 1,
      unit: String(item.unit || "Wash & Iron"),
    })),
    subtotal,
    deliveryCharge,
    rushDelivery: Boolean(body.rushDelivery),
    rushDeliveryCharge,
    total,
    trackingStep: 0,
    status: TRACKING_STEPS[0].label,
    address: {
      fullName: String(address.fullName).trim(),
      phone: String(address.phone).trim(),
      address: String(address.address).trim(),
      city: String(address.city).trim(),
      pincode: String(address.pincode).trim(),
    },
    paymentMethod,
    paymentInfo: body.paymentInfo || {},
  });

  return res.status(201).json(successResponse({ order: mapOrder(order) }, "Order created"));
};

const getMyOrders = async (req, res) => {
  const userId = req.user?.sub;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(401).json(errorResponse("Unauthorized"));
  }

  const orders = await Order.find({ customer: userId }).sort({ orderId: -1 });
  return res
    .status(200)
    .json(successResponse({ orders: orders.map(mapOrder) }));
};

const getOrderById = async (req, res) => {
  const userId = req.user?.sub;
  const role = req.user?.role;
  const orderId = Number(req.params.id);

  if (!Number.isFinite(orderId)) {
    return res.status(400).json(errorResponse("Invalid order id"));
  }

  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json(errorResponse("Order not found"));
  }

  if (role !== "admin" && String(order.customer) !== String(userId)) {
    return res.status(403).json(errorResponse("Forbidden"));
  }

  return res.status(200).json(successResponse({ order: mapOrder(order) }));
};

const getAdminOrders = async (req, res) => {
  const orders = await Order.find().sort({ orderId: -1 });
  return res.status(200).json(successResponse({ orders: orders.map(mapOrder) }));
};

const updateOrderStatus = async (req, res) => {
  const orderId = Number(req.params.id);
  const step = Number(req.body?.trackingStep);

  if (!Number.isFinite(orderId)) {
    return res.status(400).json(errorResponse("Invalid order id"));
  }

  if (!Number.isInteger(step) || step < 0 || step >= TRACKING_STEPS.length) {
    return res.status(400).json(errorResponse("Invalid tracking step"));
  }

  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json(errorResponse("Order not found"));
  }

  order.trackingStep = step;
  order.status = TRACKING_STEPS[step].label;
  await order.save();

  return res.status(200).json(successResponse({ order: mapOrder(order) }));
};

const adminUpdateOrder = async (req, res) => {
  const orderId = Number(req.params.id);
  if (!Number.isFinite(orderId)) {
    return res.status(400).json(errorResponse("Invalid order id"));
  }

  const order = await Order.findOne({ orderId });
  if (!order) {
    return res.status(404).json(errorResponse("Order not found"));
  }

  const body = req.body || {};

  if (body.trackingStep !== undefined) {
    const step = Number(body.trackingStep);
    if (!Number.isInteger(step) || step < 0 || step >= TRACKING_STEPS.length) {
      return res.status(400).json(errorResponse("Invalid tracking step"));
    }
    order.trackingStep = step;
    order.status = TRACKING_STEPS[step].label;
  }

  if (body.paymentMethod !== undefined) {
    order.paymentMethod = String(body.paymentMethod);
  }

  if (body.paymentInfo !== undefined) {
    order.paymentInfo = body.paymentInfo || {};
  }

  if (body.address && typeof body.address === "object") {
    order.address = {
      ...order.address.toObject(),
      ...body.address,
    };
  }

  await order.save();

  return res.status(200).json(successResponse({ order: mapOrder(order) }, "Order updated"));
};

const deleteOrder = async (req, res) => {
  const orderId = Number(req.params.id);

  if (!Number.isFinite(orderId)) {
    return res.status(400).json(errorResponse("Invalid order id"));
  }

  const deleted = await Order.findOneAndDelete({ orderId });
  if (!deleted) {
    return res.status(404).json(errorResponse("Order not found"));
  }

  return res.status(200).json(successResponse({ id: orderId }, "Order deleted"));
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
  adminUpdateOrder,
  deleteOrder,
};
