const Contact = require("../models/contact.model");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const env = require("../config/env");
const { sendMail } = require("../services/mailer");

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const sendContactSubmissionEmails = async (contact) => {
  const adminReceiver = env.contactReceiverEmail || env.smtpFromEmail || env.smtpUser;
  const safeName = escapeHtml(contact.name);
  const safeEmail = escapeHtml(contact.email);
  const safePhone = escapeHtml(contact.phone || "Not provided");
  const safeMessage = escapeHtml(contact.message).replace(/\n/g, "<br />");

  if (adminReceiver) {
    const adminResult = await sendMail({
      to: adminReceiver,
      subject: `New Contact Request: ${contact.name}`,
      text: `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || "Not provided"}\n\nMessage:\n${contact.message}`,
      html: `<h2>New Contact Request</h2><p><b>Name:</b> ${safeName}</p><p><b>Email:</b> ${safeEmail}</p><p><b>Phone:</b> ${safePhone}</p><p><b>Message:</b><br />${safeMessage}</p>`,
    });
    if (!adminResult.sent && env.nodeEnv !== "production") {
      console.warn("Admin contact mail skipped:", adminResult.reason || "UNKNOWN");
    }
  }

  const userResult = await sendMail({
    to: contact.email,
    subject: "We received your message | DobhiWala Support",
    text: `Hi ${contact.name},\n\nThanks for contacting us. We received your message and our support team will respond soon.\n\nYour message:\n${contact.message}\n\n- DobhiWala Support`,
    html: `<p>Hi ${safeName},</p><p>Thanks for contacting us. We received your message and our support team will respond soon.</p><p><b>Your message:</b><br />${safeMessage}</p><p>- DobhiWala Support</p>`,
  });
  if (!userResult.sent && env.nodeEnv !== "production") {
    console.warn("User acknowledgement mail skipped:", userResult.reason || "UNKNOWN");
  }
};

// POST /api/contact
async function createContact(req, res) {
  const { name, email, phone, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json(errorResponse("Name, email, and message are required"));
  }
  try {
    const contact = await Contact.create({ name, email, phone, message });
    try {
      await sendContactSubmissionEmails(contact);
    } catch (mailErr) {
      if (env.nodeEnv !== "production") {
        console.error("Contact email send failed:", mailErr.message);
      }
    }
    return res.status(201).json(successResponse({ contact }, "Message received. We'll contact you soon."));
  } catch (err) {
    return res.status(500).json(errorResponse("Failed to submit message"));
  }
}

// GET /api/contact (admin only)
async function getContacts(req, res) {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return res.status(200).json(successResponse({ contacts }));
}

// PATCH /api/contact/:id (admin: update status)
async function updateContactStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json(errorResponse("Status is required"));
  const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
  if (!contact) return res.status(404).json(errorResponse("Contact not found"));
  return res.status(200).json(successResponse({ contact }, "Status updated"));
}

// POST /api/contact/:id/reply (admin)
async function replyToContact(req, res) {
  const { id } = req.params;
  const replyMessage = String(req.body?.replyMessage || "").trim();
  if (!replyMessage) {
    return res.status(400).json(errorResponse("replyMessage is required"));
  }

  const contact = await Contact.findById(id);
  if (!contact) return res.status(404).json(errorResponse("Contact not found"));

  const safeName = escapeHtml(contact.name);
  const safeReply = escapeHtml(replyMessage).replace(/\n/g, "<br />");

  try {
    const result = await sendMail({
      to: contact.email,
      subject: "Support Reply | DobhiWala",
      text: `Hi ${contact.name},\n\n${replyMessage}\n\n- DobhiWala Support`,
      html: `<p>Hi ${safeName},</p><p>${safeReply}</p><p>- DobhiWala Support</p>`,
    });
    if (!result.sent) {
      return res.status(500).json(errorResponse("SMTP not configured. Reply email not sent"));
    }
  } catch (err) {
    const message =
      env.nodeEnv !== "production"
        ? `Failed to send reply email: ${err.message}`
        : "Failed to send reply email";
    return res.status(500).json(errorResponse(message));
  }

  contact.adminReply = replyMessage;
  contact.status = "resolved";
  contact.repliedAt = new Date();
  await contact.save();

  return res.status(200).json(successResponse({ contact }, "Reply sent to customer"));
}

module.exports = { createContact, getContacts, updateContactStatus, replyToContact };
