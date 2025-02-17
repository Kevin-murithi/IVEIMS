const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { scheduleMaintenance, getAllMaintenance, getDueForMaintenance, getMaintenanceById, logMaintenanceReminder, getMaintenanceReminders } = require('../controllers/maintenanceController');

const router = express.Router();

// Schedule Maintenance (Admins & Technicians)
router.post('/schedule/:id', authMiddleware(['admin', 'technician']), scheduleMaintenance);

// Get all maintenance schedules (Admins & Technicians)
router.get('/all', authMiddleware(['admin', 'technician']), getAllMaintenance);

// Get overdue maintenance (Admins & Technicians)
router.get('/due', authMiddleware(['admin', 'technician']), getDueForMaintenance);

// Get maintenance reminders (Admins & Technicians) - ✅ Placed before `/:id`
router.get('/reminders', authMiddleware(['admin', 'technician']), getMaintenanceReminders);

// Get maintenance history for a specific equipment (Ensuring ID format is correct)
router.get('/:id([0-9]+)', authMiddleware(), getMaintenanceById);

// Log maintenance reminder into database (Admins & Technicians)
router.post('/log-reminders', authMiddleware(['admin', 'technician']), logMaintenanceReminder);

module.exports = router;