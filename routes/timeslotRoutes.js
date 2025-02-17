// timeslotRoutes.js - Handles time slot allocation for resources
const express = require('express');
const router = express.Router();
const timeslotController = require('../controllers/timeslotController');

// Time slot allocation routes
router.post('/allocate', timeslotController.allocateTimeSlot);
router.get('/availability', timeslotController.checkSlotAvailability);
router.get('/schedule', timeslotController.getSchedule);

module.exports = router;
