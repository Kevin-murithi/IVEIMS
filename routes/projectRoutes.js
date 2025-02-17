const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { getProjects, createProject, updateProjectStatus } = require('../controllers/projectController');

const router = express.Router();

router.get('/', authenticateUser, getProjects);
router.post('/create', authenticateUser, createProject);
router.patch('/:id/status', authenticateUser, updateProjectStatus);

module.exports = router;
