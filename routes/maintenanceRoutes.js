const express = require('express');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
const { scheduleMaintenance } = require('../controllers/maintenanceController');
const { getAllMaintenance, getDueForMaintenance, getMaintenanceById, logMaintenanceReminder, getMaintenanceReminders } = require('../controllers/maintenanceController');

const router = express.Router();

// Schedule Maintenance (Admins & Technicians)
router.post('/schedule/:id', authenticateUser, authorizeRole(['admin', 'technician']), scheduleMaintenance);

// Get all maintenance schedules (Admins & Technicians)
router.get('/all', authenticateUser, getAllMaintenance);

// Get overdue maintenance (Admins & Technicians)
router.get('/due', authenticateUser, getDueForMaintenance);

// Get maintenance history for a specific equipment
// ✅ FIX: Define `/reminders` BEFORE `/:id`
router.get('/reminders', authenticateUser, authorizeRole(['admin', 'technician']), getMaintenanceReminders);

// ✅ FIX: Ensure `:id` is handled properly
router.get('/:id([0-9]+)', authenticateUser, getMaintenanceById);

// Log maintenance reminder into database
router.post('/log-reminders', authenticateUser, authorizeRole(['admin', 'technician']), logMaintenanceReminder);


module.exports = router;
