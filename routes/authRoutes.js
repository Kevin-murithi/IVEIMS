const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const {authenticateUser, authorizeRole} = require ('../middleware/authMiddleware.js');
const { checkAuthStatus } = require('../controllers/authController');

const db = require('../config/db.js');
const sendEmail = require('../config/emailService.js');



router.post('/register', register);
router.post('/login', login);

router.get('/admin', authenticateUser, authorizeRole(['admin']), (req, res) => {
    res.json({ message: 'Welcome Admin!', user: req.session.user });
});

router.get('/technician', authenticateUser, authorizeRole(['technician']), (req, res) => {
    res.json({ message: 'Welcome Technician!', user: req.session.user });
});

router.get('/student', authenticateUser, authorizeRole(['student']), (req, res) => {
    res.json({ message: 'Welcome Student!', user: req.session.user });
});

router.get('/lab_manager', authenticateUser, authorizeRole(['lab_manager']), (req, res) => {
    res.json({ message: 'Welcome Lab Manager!', user: req.session.user });
});

// Get All Pending Users (For Admins)
router.get('/pending-users', authenticateUser, authorizeRole(['admin']), (req, res) => {
    const sql = 'SELECT id, name, email, role FROM users WHERE approved = false';
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

// Approve a User (For Admins)
router.post('/approve-user/:id', authenticateUser, authorizeRole(['admin']), (req, res) => {
    const userId = req.params.id;

    const sql = 'UPDATE users SET approved = true WHERE id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        // Fetch user email to notify them
        const getUserSql = 'SELECT name, email FROM users WHERE id = ?';
        db.query(getUserSql, [userId], (err, userResult) => {
            if (err) return res.status(500).json({ message: 'Database error' });

            const user = userResult[0];

            // Send approval email
            sendEmail(user.email, 
                'Your IvE IMS Account Has Been Approved', 
                `Hello ${user.name},\n\nYour account has been approved! You can now log in and start using the system.`,
                `<p>Hello ${user.name},</p><p>Your account has been approved! You can now log in and start using the system.</p>`
            );

            res.json({ message: 'User approved successfully and notified via email' });
        });
    });
});

// ✅ New Route: Check user login status
router.get('/status', authenticateUser, checkAuthStatus);


module.exports = router;
