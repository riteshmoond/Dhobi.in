const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      default: "Wash & Iron",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    img: {
      type: String,
      default: "",
      trim: true,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: ["men", "female", "kids"],
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
