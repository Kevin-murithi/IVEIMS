const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const projectController = require('../controllers/projectController'); // Ensure this exists

const router = express.Router();

router.get('/', authMiddleware(), projectController.getProjects);
router.post('/create', authMiddleware(), projectController.createProject);
router.patch('/:id/status', authMiddleware(), projectController.updateProjectStatus);

module.exports = router;
