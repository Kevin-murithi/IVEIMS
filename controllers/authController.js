const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.js');
const sendEmail = require('../config/emailService.js');
const dotenv = require('dotenv');
dotenv.config();

// Function to generate and store token in cookies
const generateToken = (user, res) => {
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    console.log("JWT: ", token); // Debugging, remove in production

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'Strict',
        maxAge: 3600000 // 1 hour
    });

    return token;
};

// **Register User**
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

                const newUser = {
                    id: result.insertId,
                    name,
                    email,
                    role: assignedRole,
                    approved: isApproved
                };

                // Generate JWT and store it in cookies
                generateToken(newUser, res);

                // Send email notification
                sendEmail(email, 
                    'IvE IMS Registration Successful', 
                    `Hello ${name},\n\nYour registration was successful. Please wait for admin approval.`,
                    `<p>Hello ${name},</p><p>Your registration was successful. Please wait for admin approval.</p>`
                );

                res.status(201).json({ 
                    message: 'Registration successful, awaiting admin approval.', 
                    user: newUser
                });
            });
        });
    });
};


// **Login User**
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

            // Generate token and store in cookie
            generateToken(user, res);

            res.json({ message: 'Login successful for user: ', user});
        });
    });
};

// **Check Authentication Status**
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

// **Logout User**
exports.logout = (req, res) => {
    res.cookie('token', '', { 
        httpOnly: true, 
        expires: new Date(0) // Expire the cookie
    });

    res.json({ message: 'Logged out successfully' });
};