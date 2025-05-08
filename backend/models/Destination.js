const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: String }, // e.g., "5 days"
  type: { type: String }, // e.g., "Adventure", "Luxury"
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Destination", DestinationSchema);
