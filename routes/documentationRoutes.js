const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { uploadFile, getFilesByProject } = require('../controllers/documentationController'); // ✅ Ensure this is correct

const router = express.Router();

router.post('/upload', authenticateUser, uploadFile);
router.get('/:project_id', authenticateUser, getFilesByProject);

module.exports = router;
