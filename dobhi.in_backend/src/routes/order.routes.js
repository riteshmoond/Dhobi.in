const express = require("express");

const asyncHandler = require("../middlewares/asyncHandler");
const authGuard = require("../middlewares/authGuard");
const validateRequest = require("../middlewares/validateRequest");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAdminOrders,
  updateOrderStatus,
  adminUpdateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const {
  createOrderSchema,
  updateOrderStatusSchema,
  adminUpdateOrderSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post("/", authGuard(), validateRequest(createOrderSchema), asyncHandler(createOrder));
router.get("/my", authGuard(), asyncHandler(getMyOrders));

router.get("/admin/all", authGuard("admin"), asyncHandler(getAdminOrders));
router.patch(
  "/admin/:id/status",
  authGuard("admin"),
  validateRequest(updateOrderStatusSchema),
  asyncHandler(updateOrderStatus)
);
router.patch(
  "/admin/:id",
  authGuard("admin"),
  validateRequest(adminUpdateOrderSchema),
  asyncHandler(adminUpdateOrder)
);
router.delete("/admin/:id", authGuard("admin"), asyncHandler(deleteOrder));
router.get("/:id", authGuard(), asyncHandler(getOrderById));

module.exports = router;
