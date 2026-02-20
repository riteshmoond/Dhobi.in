const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    customerName: { type: String, default: "" },
    orderId: { type: Number, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

ratingSchema.index({ customer: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
