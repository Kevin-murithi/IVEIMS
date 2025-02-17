const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateUser = (req, res, next) => {
    console.log("🔍 Received Headers:", req.headers); // ✅ LOG ALL HEADERS

    const authHeader = req.header('Authorization');

    console.log("🔍 Received Auth Header:", authHeader || "❌ No Authorization Header Found"); // ✅ LOG HEADER

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    console.log("🔍 Extracted Token:", token); // ✅ LOG TOKEN

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // ✅ Attach user info to request
        console.log("✅ Decoded Token:", decoded); // ✅ LOG USER INFO
        next();
    } catch (err) {
        console.error("❌ Token Verification Error:", err.message);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }
        next();
    };
};