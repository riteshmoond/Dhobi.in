const express = require("express");
const {
  createContact,
  getContacts,
  updateContactStatus,
  replyToContact,
} = require("../controllers/contact.controller");
const authGuard = require("../middlewares/authGuard");
const asyncHandler = require("../middlewares/asyncHandler");
const requireDb = require("../middlewares/requireDb");
const validateRequest = require("../middlewares/validateRequest");
const {
  createContactSchema,
  updateContactStatusSchema,
  replyContactSchema,
} = require("../validators/requestSchemas");

const router = express.Router();

// User: submit contact form
router.post("/", requireDb, validateRequest(createContactSchema), asyncHandler(createContact));
// Admin: get all contacts
router.get("/", requireDb, authGuard("admin"), asyncHandler(getContacts));
// Admin: update contact status
router.patch(
  "/:id",
  requireDb,
  authGuard("admin"),
  validateRequest(updateContactStatusSchema),
  asyncHandler(updateContactStatus)
);
// Admin: send reply to customer email
router.post(
  "/:id/reply",
  requireDb,
  authGuard("admin"),
  validateRequest(replyContactSchema),
  asyncHandler(replyToContact)
);

module.exports = router;
