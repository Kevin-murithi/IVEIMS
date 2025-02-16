const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');

const sendEmail = require('../config/emailService.js');

exports.register = (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const checkUserCount = 'SELECT COUNT(*) AS count FROM users';
    db.query(checkUserCount, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const userCount = results[0].count;
        let assignedRole = userCount === 0 ? 'admin' : role;
        let isApproved = userCount === 0; // First user auto-approved

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: 'Error hashing password' });

            const sql = 'INSERT INTO users (name, email, password, role, approved) VALUES (?, ?, ?, ?, ?)';
            db.query(sql, [name, email, hashedPassword, assignedRole, isApproved], (err, result) => {
                if (err) return res.status(500).json({ message: 'Error registering user' });

                // Send email notification
                sendEmail(email, 
                    'IvE IMS Registration Successful', 
                    `Hello ${name},\n\nYour registration was successful. Please wait for admin approval.`,
                    `<p>Hello ${name},</p><p>Your registration was successful. Please wait for admin approval.</p>`
                );

                res.status(201).json({ 
                    message: 'Registration successful, awaiting admin approval.', 
                    role: assignedRole 
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

            if (!user.approved) {
                return res.status(403).json({ message: 'Your account is pending approval from an admin.' });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(token)

            req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role, token };

            res.json({ message: 'Login successful', redirect: `/api/dashboard/${user.role}` });
        });
    });
};

exports.checkAuthStatus = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json({
        message: 'User is authenticated',
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};



