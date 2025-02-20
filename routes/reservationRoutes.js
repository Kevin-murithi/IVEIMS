const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController'); // Correct import
const { authMiddleware } = require('../middleware/authMiddleware');


// Debugging: Check if `reservationController` is loaded
console.log("📌 Loaded reservationController:", reservationController);

router.post('/reserve', authMiddleware(), reservationController.createReservation);
router.get('/reservations', reservationController.getReservations);

module.exports = router;
