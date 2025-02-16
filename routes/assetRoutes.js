const express = require('express');
const { authenticateUser, authorizeRole } = require('../middleware/authMiddleware');
const { transferAsset, getAssetTransfers } = require('../controllers/assetController');

const router = express.Router();

// Transfer an asset to another lab (Admins & Technicians)
router.post('/transfer', authenticateUser, authorizeRole(['admin', 'technician']), transferAsset);

// Get asset transfer history
router.get('/transfers/:equipmentId', authenticateUser, getAssetTransfers);

module.exports = router;
