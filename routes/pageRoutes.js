const express = require('express');
const loadPages = require('../controllers/loadpages.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const db = require('../config/db.js');

const router = express.Router();

router.get('/', loadPages.landingPage);
router.get('/signupGet', loadPages.signupGet);
router.get('/signinGet', loadPages.signinGet);
router.get('/dashboardGet', loadPages.dashboardGet);
router.get('/inventoryGet', loadPages.inventoryGet);

module.exports = router;