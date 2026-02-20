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
const { authLimiter } = require("../middlewares/security");
const {
  loginSchema,
  signupSchema,
  refreshTokenSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

router.post("/signup", authLimiter, validateRequest(signupSchema), signupCustomer);
router.post("/login", authLimiter, validateRequest(loginSchema), loginCustomer);
router.post("/admin/login", authLimiter, validateRequest(loginSchema), loginAdmin);
router.post("/refresh", authLimiter, validateRequest(refreshTokenSchema), refreshAccessToken);
router.post("/logout", validateRequest(refreshTokenSchema), logout);
router.get("/me", authGuard(), getCurrentUser);

module.exports = router;
