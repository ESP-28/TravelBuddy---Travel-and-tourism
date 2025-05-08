const express = require("express");
const Destination = require("../models/Destination");

const router = express.Router();

// POST /destinations/add
router.post("/add", async (req, res) => {
  try {
    const newDestination = new Destination(req.body);
    await newDestination.save();
    res.status(201).json({ msg: "Destination added", destination: newDestination });
  } catch (err) {
    res.status(500).json({ msg: "Error adding destination", error: err.message });
  }
});

// GET /destinations
router.get("/", async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching destinations" });
  }
});

module.exports = router;
