const express = require("express");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");
const BuddyRequest = require("../models/BuddyRequest");

const router = express.Router();

// 🔍 Search for Travel Buddies
router.post("/search", verifyToken, async (req, res) => {
  const { city, preferredDestination, travelInterest } = req.body;

  let query = {};
  if (city) query.city = city;
  if (preferredDestination) query.preferredDestination = preferredDestination;
  if (travelInterest) query.travelInterests = { $regex: travelInterest, $options: "i" };

  try {
    const matches = await User.find(query).select("-password");
    res.json(matches);
  } catch (err) {
    res.status(500).json({ msg: "Search failed" });
  }
});

// ✅ Send Buddy Request
router.post("/request", verifyToken, async (req, res) => {
  const senderId = req.userId;
  const { receiverId } = req.body;

  if (senderId === receiverId) {
    return res.status(400).json({ msg: "You cannot send a request to yourself." });
  }

  try {
    const existing = await BuddyRequest.findOne({ sender: senderId, receiver: receiverId });
    if (existing) {
      return res.status(409).json({ msg: "Buddy request already sent." });
    }

    const request = new BuddyRequest({ sender: senderId, receiver: receiverId });
    await request.save();
    res.status(201).json({ msg: "Buddy request sent!" });
  } catch (err) {
    res.status(500).json({ msg: "Error sending request" });
  }
});

module.exports = router;
