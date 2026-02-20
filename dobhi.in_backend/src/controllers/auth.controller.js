const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const env = require("../config/env");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const { errorResponse, successResponse } = require("../utils/apiResponse");

const ADMIN_EMAIL = "admin@dhobi.in";
const ADMIN_PASSWORD = "admin123";

const issueAccessToken = (user) =>
  jwt.sign({ sub: String(user._id), role: user.role, email: user.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

const getRefreshTokenExpiryDate = (token) => {
  const payload = jwt.decode(token);
  if (payload?.exp) {
    return new Date(payload.exp * 1000);
  }
  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 30);
  return fallback;
};

const issueRefreshToken = async (user) => {
  const token = jwt.sign(
    {
      sub: String(user._id),
      role: user.role,
      type: "refresh",
    },
    env.jwtRefreshSecret,
    {
      expiresIn: env.jwtRefreshExpiresIn,
    }
  );

  await RefreshToken.create({
    user: user._id,
    token,
    expiresAt: getRefreshTokenExpiryDate(token),
  });

  return token;
};

const sanitizeUser = (user) => ({
  id: String(user._id),
  email: user.email,
  fullName: user.fullName,
  role: user.role,
});

const buildAuthResponse = async (user) => {
  const token = issueAccessToken(user);
  const refreshToken = await issueRefreshToken(user);

  return {
    user: sanitizeUser(user),
    token,
    refreshToken,
  };
};

const ensureAdminSeed = async () => {
  const existingAdmin = await User.findOne({ email: ADMIN_EMAIL }).select("_id");
  if (existingAdmin) return;

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({
    email: ADMIN_EMAIL,
    fullName: "System Admin",
    role: "admin",
    passwordHash,
  });
};

const signupCustomer = async (req, res) => {
  const { email, password, fullName } = req.body;
  const existing = await User.findOne({ email }).select("_id");

  if (existing) {
    return res.status(409).json(errorResponse("Email already exists"));
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    fullName,
    role: "customer",
    passwordHash,
  });

  return res.status(201).json(successResponse(await buildAuthResponse(user)));
};

const loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: "customer" });

  if (!user) {
    return res.status(401).json(errorResponse("Invalid email or password"));
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json(errorResponse("Invalid email or password"));
  }

  return res.status(200).json(successResponse(await buildAuthResponse(user)));
};

const loginAdmin = async (req, res) => {
  await ensureAdminSeed();

  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: "admin" });

  if (!admin) {
    return res.status(401).json(errorResponse("Invalid admin credentials"));
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json(errorResponse("Invalid admin credentials"));
  }

  return res.status(200).json(successResponse(await buildAuthResponse(admin)));
};

const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
  } catch {
    return res.status(401).json(errorResponse("Invalid refresh token"));
  }

  if (payload?.type !== "refresh") {
    return res.status(401).json(errorResponse("Invalid refresh token type"));
  }

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored || stored.revokedAt) {
    return res.status(401).json(errorResponse("Refresh token revoked"));
  }

  if (stored.expiresAt < new Date()) {
    return res.status(401).json(errorResponse("Refresh token expired"));
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    return res.status(401).json(errorResponse("User not found"));
  }

  const token = issueAccessToken(user);
  return res.status(200).json(successResponse({ token }));
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (stored && !stored.revokedAt) {
    stored.revokedAt = new Date();
    await stored.save();
  }

  return res.status(200).json(successResponse({}, "Logged out"));
};

const getCurrentUser = async (req, res) => {
  const userId = req.user?.sub;
  if (!userId) {
    return res.status(401).json(errorResponse("Unauthorized"));
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json(errorResponse("User not found"));
  }

  return res.status(200).json(successResponse({ user: sanitizeUser(user) }));
};

module.exports = {
  signupCustomer,
  loginCustomer,
  loginAdmin,
  refreshAccessToken,
  logout,
  getCurrentUser,
};
