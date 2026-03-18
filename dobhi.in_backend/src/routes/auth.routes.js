const express = require("express");

const {
  signupCustomer,
  loginCustomer,
  loginAdmin,
  refreshAccessToken,
  logout,
  getCurrentUser,
} = require("../controllers/auth.controller");
const validateRequest = require("../middlewares/validateRequest");
const authGuard = require("../middlewares/authGuard");
const requireDb = require("../middlewares/requireDb");
const { authLimiter } = require("../middlewares/security");
const {
  loginSchema,
  signupSchema,
  refreshTokenSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post("/signup", authLimiter, validateRequest(signupSchema), requireDb, signupCustomer);
router.post("/login", authLimiter, validateRequest(loginSchema), requireDb, loginCustomer);
router.post("/admin/login", authLimiter, validateRequest(loginSchema), requireDb, loginAdmin);
router.post("/refresh", authLimiter, validateRequest(refreshTokenSchema), requireDb, refreshAccessToken);
router.post("/logout", validateRequest(refreshTokenSchema), requireDb, logout);
router.get("/me", requireDb, authGuard(), getCurrentUser);

module.exports = router;
