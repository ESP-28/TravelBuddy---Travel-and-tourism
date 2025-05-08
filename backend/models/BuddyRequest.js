const express = require("express");
const verifyToken = require("../middleware/auth");
const User = require("../models/User");
const BuddyRequest = require("../models/BuddyRequest");

const router = express.Router();

// 🔍 Search for Buddies
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

// 📩 Send Buddy Request
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

// 📥 View Incoming Requests
router.get("/requests", verifyToken, async (req, res) => {
  try {
    const requests = await BuddyRequest.find({ receiver: req.userId })
      .populate("sender", "name email travelInterests")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch requests" });
  }
});

// ✅ Accept or Decline Request
router.put("/requests/respond", verifyToken, async (req, res) => {
  const { requestId, action } = req.body;

  if (!["accepted", "declined"].includes(action)) {
    return res.status(400).json({ msg: "Invalid action" });
  }

  try {
    const request = await BuddyRequest.findOneAndUpdate(
      { _id: requestId, receiver: req.userId },
      { status: action },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ msg: "Request not found" });
    }

    res.json({ msg: `Request ${action}` });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update request" });
  }
});

module.exports = router;
