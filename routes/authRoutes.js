const express = require('express');
const { register, login, checkAuthStatus } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const db = require('../config/db.js');
const sendEmail = require('../config/emailService.js');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/admin', authMiddleware(['admin']), (req, res) => {
    res.json({ message: 'Welcome Admin!', user: req.user });
});

router.get('/technician', authMiddleware(['technician']), (req, res) => {
    res.json({ message: 'Welcome Technician!', user: req.user });
});

router.get('/student', authMiddleware(['student']), (req, res) => {
    res.json({ message: 'Welcome Student!', user: req.user });
});

router.get('/lab_manager', authMiddleware(['lab_manager']), (req, res) => {
    res.json({ message: 'Welcome Lab Manager!', user: req.user });
});

router.get('/pending-users', authMiddleware(['admin']), (req, res) => {
    console.log("🔍 User Requesting Data:", req.user);
    const sql = 'SELECT id, name, email, role FROM users WHERE approved = false';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database Error:", err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        console.log("✅ Pending Users Found:", results);
        res.json(results);
    });
});

router.post('/approve-user/:id', authMiddleware(['admin']), (req, res) => {
    const userId = req.params.id;
    console.log(`🔍 Approving User ID: ${userId}`);
    
    const sql = 'UPDATE users SET approved = true WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("❌ Database Error (Update):", err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found or already approved' });
        }
        
        const getUserSql = 'SELECT name, email FROM users WHERE id = ?';
        db.query(getUserSql, [userId], (err, userResult) => {
            if (err) {
                console.error("❌ Database Error (Fetch User):", err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (!userResult || userResult.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            const user = userResult[0];
            sendEmail(
                user.email, 
                'Your IvE IMS Account Has Been Approved', 
                `Hello ${user.name},\n\nYour account has been approved! You can now log in and start using the system.`,
                `<p>Hello ${user.name},</p><p>Your account has been approved! You can now log in and start using the system.</p>`
            );

            res.json({ message: 'User approved successfully and notified via email' });
        });
    });
});

router.get('/status', authMiddleware(), checkAuthStatus);

module.exports = router;