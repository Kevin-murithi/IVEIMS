const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addEquipment, getAllEquipment, updateEquipmentStatus, deleteEquipment } = require('../controllers/inventoryController');

const router = express.Router();

// Add new equipment (Admins & Technicians)
router.post('/add', authMiddleware(['admin', 'technician']), addEquipment);

// Get all equipment (Everyone)
router.get('/all', authMiddleware(), getAllEquipment);

// Update equipment status (Admins & Technicians)
router.put('/update/:id', authMiddleware(['admin', 'technician']), updateEquipmentStatus);

// Delete equipment (Admins only)
router.delete('/delete/:id', authMiddleware(['admin']), deleteEquipment);

module.exports = router;
