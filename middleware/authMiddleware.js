const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');

    console.log("🔍 Received Auth Header:", authHeader); // ✅ LOG HEADER

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // ✅ Allow both "Bearer" and "JWT Bearer"
    const parts = authHeader.split(' ');
    if (parts.length < 2 || (parts[0] !== 'Bearer' && parts[0] !== 'JWT')) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = parts[1].trim(); // ✅ Extract token and remove spaces

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