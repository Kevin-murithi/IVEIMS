const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const { createReservation, getReservations } = require('../controllers/reservationController');

const router = express.Router();

router.post('/reserve', authenticateUser, createReservation);
router.get('/', authenticateUser, getReservations);

module.exports = router;
