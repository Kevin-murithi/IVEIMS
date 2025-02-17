const db = require('../config/db');

const Reservation = {
    createReservation: (equipment_id, project_id, reserved_by, start_time, end_time, callback) => {
        // ✅ Check for conflicts & return details of who reserved it
        const conflictCheck = `
            SELECT r.start_time, r.end_time, u.name AS reserved_by_name 
            FROM reservations r
            JOIN users u ON r.reserved_by = u.id  -- Get user's name
            WHERE r.equipment_id = ? 
            AND r.status IN ('approved', 'pending') -- Consider both pending & approved
            AND (
                (? >= r.start_time AND ? < r.end_time)  -- New start overlaps existing
                OR (? > r.start_time AND ? <= r.end_time)  -- New end overlaps existing
                OR (r.start_time >= ? AND r.end_time <= ?)  -- Fully contained
            )
        `;

        db.query(conflictCheck, [equipment_id, start_time, start_time, end_time, end_time, start_time, end_time], (err, conflicts) => {
            if (err) return callback(err);
            
            // ❌ If conflicts exist, return who reserved it and until when
            if (conflicts.length > 0) {
                const conflict = conflicts[0]; // Get first conflicting reservation
                return callback(null, { 
                    message: `⚠️ Equipment is already reserved by ${conflict.reserved_by_name} until ${conflict.end_time}` 
                });
            }

            // ✅ Proceed with reservation if no conflicts
            const sql = "INSERT INTO reservations (equipment_id, project_id, reserved_by, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, 'pending')";
            db.query(sql, [equipment_id, project_id, reserved_by, start_time, end_time], callback);
        });
    },

    getReservations: (callback) => {
        const sql = "SELECT * FROM reservations";
        db.query(sql, callback);
    }
};

module.exports = Reservation;
