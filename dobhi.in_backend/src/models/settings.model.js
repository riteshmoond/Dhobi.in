const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    deliveryCharge: { type: Number, default: 50, min: 0 },
    minOrderValue: { type: Number, default: 200, min: 0 },
    businessHours: { type: String, default: "9 AM - 9 PM" },
    serviceArea: { type: String, default: "All" },
    brandName: { type: String, default: "DobhiWala", trim: true },
    logoUrl: { type: String, default: "", trim: true },
    supportPhone: { type: String, default: "+91 98765 43210", trim: true },
    supportEmail: { type: String, default: "help@dobhiwala.in", trim: true },
    supportAddress: { type: String, default: "Jaipur, Rajasthan", trim: true },
    rushDeliveryEnabled: { type: Boolean, default: false },
    rushDeliveryCharge: { type: Number, default: 80, min: 0 },
    ordersEnabled: { type: Boolean, default: true },
    categoryVisibility: {
      men: { type: Boolean, default: true },
      female: { type: Boolean, default: true },
      kids: { type: Boolean, default: true },
    },
    paymentMethods: {
      cod: { type: Boolean, default: true },
      upi: { type: Boolean, default: true },
      card: { type: Boolean, default: true },
      netbanking: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);
