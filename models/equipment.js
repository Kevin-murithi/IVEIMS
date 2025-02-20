const db = require('../config/db');

const Equipment = {
    // Add new equipment
    addEquipment: (name, lab, uniqueCode, currentLab, status, callback) => {
        const sql = 'INSERT INTO equipment (name, lab, unique_code, current_lab, status) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [name, lab, uniqueCode, currentLab, status], callback);
    },
    
    // Get all equipment
    getAllEquipment: (callback) => {
        const sql = 'SELECT * FROM equipment';
        db.query(sql, callback);
    },

    // Get equipment by ID
    getEquipmentById: (id, callback) => {
        const sql = 'SELECT * FROM equipment WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Update equipment status
    updateEquipmentStatus: (id, status, callback) => {
        const sql = 'UPDATE equipment SET status = ? WHERE id = ?';
        db.query(sql, [status, id], callback);
    },

    // Delete equipment
    deleteEquipment: (id, callback) => {
        const sql = 'DELETE FROM equipment WHERE id = ?';
        db.query(sql, [id], callback);
    },

    // Schedule maintenance
    scheduleMaintenance: (id, lastMaintenance, nextMaintenance, callback) => {
        const sql = 'UPDATE equipment SET last_maintenance = ?, next_maintenance = ? WHERE id = ?';
        db.query(sql, [lastMaintenance, nextMaintenance, id], callback);
    },

    // Get equipment due for maintenance
    getDueForMaintenance: (callback) => {
        const sql = 'SELECT * FROM equipment WHERE next_maintenance <= CURDATE()';
        db.query(sql, callback);
    },

    // Get all maintenance schedules
    getAllMaintenance: (callback) => {
        const sql = 'SELECT id, name, last_maintenance, next_maintenance FROM equipment';
        db.query(sql, callback);
    },

    // Log maintenance reminder into the reminders table
    logMaintenanceReminder: (equipmentId, reminderDate, callback) => {
        const sql = 'INSERT INTO maintenance_reminders (equipment_id, reminder_date) VALUES (?, ?)';
        db.query(sql, [equipmentId, reminderDate], callback);
    },

    // Get maintenance details by equipment ID
    getMaintenanceById: (id, callback) => {
        const equipmentId = Number(id);
        if (isNaN(equipmentId) || equipmentId <= 0) {
            return callback(new Error("Invalid equipment ID"), null);
        }
        
        const sql = `
            SELECT 
                e.id AS equipment_id, 
                e.name AS equipment_name, 
                e.lab, 
                e.last_maintenance, 
                e.next_maintenance, 
                mr.id AS reminder_id, 
                mr.reminder_date, 
                mr.status
            FROM equipment e
            LEFT JOIN maintenance_reminders mr ON e.id = mr.equipment_id
            WHERE e.id = ?
            ORDER BY mr.reminder_date DESC;
        `;
    
        db.query(sql, [equipmentId], (err, results) => {
            if (err) return callback(err, null);
            if (!results || results.length === 0) {
                return callback(null, { message: "No maintenance records found for this equipment" });
            }
            callback(null, results);
        });
    },

    // Get all maintenance reminders
    getAllReminders: (callback) => {
        const sql = `
            SELECT 
                mr.id AS reminder_id, 
                mr.equipment_id, 
                COALESCE(e.name, 'Unknown Equipment') AS equipment_name, 
                COALESCE(e.lab, 'Unknown Lab') AS lab, 
                mr.reminder_date, 
                mr.status
            FROM maintenance_reminders mr
            LEFT JOIN equipment e ON mr.equipment_id = e.id
            ORDER BY mr.reminder_date DESC;
        `;
        db.query(sql, callback);
    },

    // Update maintenance reminder status
    updateReminderStatus: (reminderId, status, callback) => {
        const sql = 'UPDATE maintenance_reminders SET status = ? WHERE id = ?';
        db.query(sql, [status, reminderId], callback);
    },

    // Delete maintenance reminder
    deleteReminder: (reminderId, callback) => {
        const sql = 'DELETE FROM maintenance_reminders WHERE id = ?';
        db.query(sql, [reminderId], callback);
    }
};

module.exports = Equipment;
