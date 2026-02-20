const Order = require("../models/order.model");
const User = require("../models/user.model");
const { successResponse } = require("../utils/apiResponse");

const getCustomers = async (req, res) => {
  const users = await User.find({ role: "customer" })
    .select("_id fullName email createdAt")
    .sort({ createdAt: -1 });

  const userIds = users.map((u) => u._id);
  const orders = await Order.find({ customer: { $in: userIds } }).sort({ createdAt: -1 });

  const statsByUser = new Map();
  for (const order of orders) {
    const userId = String(order.customer);
    if (!statsByUser.has(userId)) {
      statsByUser.set(userId, {
        orders: 0,
        totalSpent: 0,
        phone: order.address?.phone || "N/A",
        address: order.address?.address || "N/A",
        city: order.address?.city || "N/A",
      });
    }
    const stats = statsByUser.get(userId);
    stats.orders += 1;
    stats.totalSpent += Number(order.total) || 0;
  }

  const customers = users.map((user) => {
    const stats = statsByUser.get(String(user._id));
    return {
      id: String(user._id),
      name: user.fullName || "Unknown",
      email: user.email || "N/A",
      phone: stats?.phone || "N/A",
      address: stats?.address || "N/A",
      city: stats?.city || "N/A",
      orders: stats?.orders || 0,
      totalSpent: stats?.totalSpent || 0,
      joinedAt: user.createdAt,
    };
  });

  return res.status(200).json(successResponse({ customers }));
};

module.exports = { getCustomers };
