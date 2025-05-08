const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ msg: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid token." });
    }
};

// Get User Profile
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

// Update Profile
router.put("/update", verifyToken, async (req, res) => {
    try {
        const {
            name,
            travelInterests,
            gender,
            city,
            preferredDestination
        } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {
                name,
                travelInterests,
                gender,
                city,
                preferredDestination
            },
            { new: true }
        ).select("-password");

        res.json({ msg: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
