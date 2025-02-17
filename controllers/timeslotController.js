// timeslotController.js - Controller for time slot allocation
const db = require('../config/db');

// Allocate a time slot for a resource
exports.allocateTimeSlot = (req, res) => {
    const { userId, resourceId, startTime, endTime } = req.body;
    
    // Check for conflicts
    const conflictQuery = `SELECT * FROM timeslots WHERE resource_id = ? AND 
                           ((start_time BETWEEN ? AND ?) OR (end_time BETWEEN ? AND ?))`;
    
    db.query(conflictQuery, [resourceId, startTime, endTime, startTime, endTime], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) return res.status(400).json({ message: 'Time slot already booked' });

        // Insert new time slot
        const insertQuery = 'INSERT INTO timeslots (user_id, resource_id, start_time, end_time) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [userId, resourceId, startTime, endTime], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Time slot allocated successfully', slotId: result.insertId });
        });
    });
};

// Check slot availability
exports.checkSlotAvailability = (req, res) => {
    const { resourceId, date } = req.query;
    
    const query = 'SELECT * FROM timeslots WHERE resource_id = ? AND DATE(start_time) = ?';
    db.query(query, [resourceId, date], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ available: results.length === 0 });
    });
};

// Get the schedule of time slots
exports.getSchedule = (req, res) => {
    const { resourceId } = req.query;
    
    const query = 'SELECT * FROM timeslots WHERE resource_id = ? ORDER BY start_time';
    db.query(query, [resourceId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
};
