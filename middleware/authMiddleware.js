const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Unified authentication and authorization middleware
exports.authMiddleware = (roles = []) => {
    return (req, res, next) => {
        console.log("🔍 Received Cookies:", req.cookies); // ✅ LOG COOKIES

        const token = req.cookies.token;
        console.log("🔍 Extracted Token:", token || "❌ No Token Found"); // ✅ LOG TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // ✅ Attach user info to request
            console.log("✅ Decoded Token:", decoded); // ✅ LOG USER INFO

            // Check if role-based authorization is required
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Forbidden: Access denied' });
            }

            next();
        } catch (err) {
            console.error("❌ Token Verification Error:", err.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};
