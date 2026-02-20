const Order = require("../models/order.model");
const Service = require("../models/service.model");
const { successResponse, errorResponse } = require("../utils/apiResponse");

// Get top ordered services (by quantity)
async function getTopOrderedServices(req, res) {
  try {
    // Aggregate order items and sum qty for each serviceCode
    const top = await Order.aggregate([
      { $unwind: "$items" },
      { $group: {
        _id: "$items.serviceCode",
        name: { $first: "$items.name" },
        unit: { $first: "$items.unit" },
        price: { $first: "$items.price" },
        category: { $first: "$items.category" },
        totalQty: { $sum: "$items.qty" },
      }},
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);
    return res.status(200).json(successResponse({ topServices: top }));
  } catch (err) {
    return res.status(500).json(errorResponse("Failed to fetch top services"));
  }
}

module.exports = { getTopOrderedServices };
