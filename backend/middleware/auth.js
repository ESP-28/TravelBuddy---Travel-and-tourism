const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // fallback if .env not used

function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ msg: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

module.exports = verifyToken;
