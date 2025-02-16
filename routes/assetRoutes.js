const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { transferAsset, getAssetTransfers } = require('../controllers/assetController');

const router = express.Router();

// Transfer an asset to another lab (Admins & Technicians)
router.post('/transfer', authMiddleware(['admin', 'technician']), transferAsset);

// Get asset transfer history
router.get('/transfers/:equipmentId', authMiddleware(), getAssetTransfers);

module.exports = router;