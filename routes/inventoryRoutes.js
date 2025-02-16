const express = require('express');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
const { addEquipment, getAllEquipment, updateEquipmentStatus, deleteEquipment } = require('../controllers/inventoryController');

const router = express.Router();

// Add new equipment (Admins & Technicians)
router.post('/add', authenticateUser, authorizeRole(['admin', 'technician']), addEquipment);

// Get all equipment (Everyone)
router.get('/all', authenticateUser, getAllEquipment);

// Update equipment status (Admins & Technicians)
router.put('/update/:id', authenticateUser, authorizeRole(['admin', 'technician']), updateEquipmentStatus);

// Delete equipment (Admins only)
router.delete('/delete/:id', authenticateUser, authorizeRole(['admin']), deleteEquipment);

module.exports = router;
