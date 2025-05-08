const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    travelInterests: { type: [String], default: [] },
    gender: { type: String },                      // ➕ New Field
    city: { type: String },                        // ➕ New Field
    preferredDestination: { type: String },        // ➕ New Field
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
