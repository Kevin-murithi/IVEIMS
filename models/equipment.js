const db = require('../config/db');

const Equipment = {
    addEquipment: (name, lab, uniqueCode, callback) => {
        const sql = 'INSERT INTO equipment (name, lab, unique_code) VALUES (?, ?, ?)';
        db.query(sql, [name, lab, uniqueCode], callback);
    },

    getAllEquipment: (callback) => {
        const sql = 'SELECT * FROM equipment';
        db.query(sql, callback);
    },

    getEquipmentById: (id, callback) => {
        const sql = 'SELECT * FROM equipment WHERE id = ?';
        db.query(sql, [id], callback);
    },

    updateEquipmentStatus: (id, status, callback) => {
        const sql = 'UPDATE equipment SET status = ? WHERE id = ?';
        db.query(sql, [status, id], callback);
    },

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
    
    // Get all equipment due for maintenance
    getDueForMaintenance: (callback) => {
        const sql = `
            SELECT e.id, e.name, e.lab, e.next_maintenance 
            FROM equipment e
            WHERE e.next_maintenance <= CURDATE()
        `;
        db.query(sql, callback);
    },

    // Log maintenance reminder into the reminders table
    logMaintenanceReminder: (equipmentId, callback) => {
        const sql = 'INSERT INTO maintenance_reminders (equipment_id) VALUES (?)';
        db.query(sql, [equipmentId], callback);
    },

    getMaintenanceById: (id, callback) => {
        // ✅ Convert ID to a number
        const equipmentId = Number(id);
    
        // ✅ Validate the ID properly
        if (isNaN(equipmentId) || equipmentId <= 0) {
            console.error("Invalid equipment ID:", id);
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
    
        // ✅ Execute the query with the correctly formatted ID
        db.query(sql, [equipmentId], (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return callback(err, null);
            }
    
            // ✅ Handle empty results correctly
            if (!results || results.length === 0) {
                console.log("No records found for equipment ID:", equipmentId);
                return callback(null, { message: "No maintenance records found for this equipment" });
            }
    
            // ✅ Return the results
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
        db.query(sql, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }
   
};

module.exports = Equipment;
