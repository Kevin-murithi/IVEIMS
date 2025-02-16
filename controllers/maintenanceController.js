const Equipment = require('../models/equipment');
const sendEmail = require('../config/emailService');

// Schedule Maintenance
exports.scheduleMaintenance = (req, res) => {
    const { id } = req.params;
    const { lastMaintenance, nextMaintenance } = req.body;

    if (!lastMaintenance || !nextMaintenance) {
        return res.status(400).json({ message: 'Both dates are required' });
    }

    Equipment.scheduleMaintenance(id, lastMaintenance, nextMaintenance, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Maintenance scheduled successfully' });
    });
};

// Send Maintenance Reminders
exports.sendMaintenanceReminders = () => {
    Equipment.getDueForMaintenance((err, results) => {
        if (err) return console.error('Database error:', err);
        if (results.length === 0) return console.log('No maintenance due.');

        results.forEach((equipment) => {
            sendEmail(
                'admin@example.com',
                'Maintenance Reminder',
                `Equipment ${equipment.name} requires maintenance.`,
                `<p>Equipment <strong>${equipment.name}</strong> requires maintenance.</p>`
            );
        });

        console.log('Maintenance reminders sent.');
    });
};

// Get all maintenance schedules
exports.getAllMaintenance = (req, res) => {
    Equipment.getAllMaintenance((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};

// Get overdue maintenance
exports.getDueForMaintenance = (req, res) => {
    Equipment.getDueForMaintenance((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};

// Send maintenance reminders
exports.sendMaintenanceReminders = () => {
    Equipment.getDueForMaintenance((err, results) => {
        if (err) return console.error('Database error:', err);
        if (results.length === 0) return console.log('No maintenance due.');

        results.forEach((equipment) => {
            // Send email to admins & technicians
            sendEmail(
                'admin@example.com', // Replace with real recipients
                `Maintenance Reminder: ${equipment.name}`,
                `The equipment ${equipment.name} in ${equipment.lab} requires maintenance.`,
                `<p>The equipment <strong>${equipment.name}</strong> in ${equipment.lab} requires maintenance.</p>`
            );

            // Log the reminder
            Equipment.logMaintenanceReminder(equipment.id, (logErr) => {
                if (logErr) console.error('Error logging reminder:', logErr);
            });
        });

        console.log('Maintenance reminders sent.');
    });
};

// Log maintenance reminder in the database
exports.logMaintenanceReminder = (req, res) => {
    Equipment.getDueForMaintenance((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0) return res.json({ message: 'No maintenance due' });

        results.forEach((equipment) => {
            Equipment.logMaintenanceReminder(equipment.id, (logErr) => {
                if (logErr) console.error('Error logging reminder:', logErr);
            });
        });

        res.json({ message: 'Maintenance reminders logged successfully' });
    });
};

// Get all logged maintenance reminders
exports.getMaintenanceReminders = (req, res) => {
    Equipment.getAllReminders((err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No maintenance reminders found' });
        }

        res.json(results);
    });
};

// Get maintenance history for a specific equipment
exports.getMaintenanceById = (req, res) => {
    const { id } = req.params;

    // ✅ Fix: Ensure ID is a valid number
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: `Invalid equipment ID: ${id}` });
    }

    Equipment.getMaintenanceById(id, (err, results) => {
        if (err) {
            console.error('Database Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'No maintenance records found for this equipment' });
        }

        res.json(results);
    });
};





