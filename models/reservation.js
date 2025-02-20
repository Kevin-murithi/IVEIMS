const db = require('../config/db');

const createReservation = (equipment_id, project_id, reserved_by, start_time, end_time, callback) => {
    const conflictCheck = `
        SELECT r.start_time, r.end_time, u.name AS reserved_by_name 
        FROM reservations r
        JOIN users u ON r.reserved_by = u.id
        WHERE r.equipment_id = ? 
        AND r.status IN ('approved', 'pending') 
        AND (
            (? >= r.start_time AND ? < r.end_time)  
            OR (? > r.start_time AND ? <= r.end_time)  
            OR (r.start_time >= ? AND r.end_time <= ?)  
        )
    `;

    db.query(conflictCheck, [equipment_id, start_time, start_time, end_time, end_time, start_time, end_time], (err, conflicts) => {
        if (err) return callback(err);
        
        if (conflicts.length > 0) {
            return callback(null, { 
                message: `⚠️ Equipment is already reserved by ${conflicts[0].reserved_by_name} until ${conflicts[0].end_time}` 
            });
        }

        const sql = "INSERT INTO reservations (equipment_id, project_id, reserved_by, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, 'pending')";
        db.query(sql, [equipment_id, project_id, reserved_by, start_time, end_time], (err, result) => {
            if (err) return callback(err);

            const usageLogSql = "INSERT INTO usage_history (equipment_id, user_id, start_time, end_time) VALUES (?, ?, ?, ?)";
            db.query(usageLogSql, [equipment_id, reserved_by, start_time, end_time], (logErr) => {
                if (logErr) return callback(logErr);
                return callback(null, { message: "✅ Reservation created successfully and logged." });
            });
        });
    });
};

const getReservations = (callback) => {
    const sql = `
        SELECT r.*, u.name AS reserved_by_name, e.name AS equipment_name 
        FROM reservations r
        JOIN users u ON r.reserved_by = u.id
        JOIN equipment e ON r.equipment_id = e.id
    `;
    db.query(sql, callback);
};

// ✅ Correctly export functions
module.exports = {
    createReservation,
    getReservations
};
