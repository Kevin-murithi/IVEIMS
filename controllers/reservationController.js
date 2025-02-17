const Reservation = require('../models/reservation');

exports.createReservation = (req, res) => {
    const { equipment_id, project_id, start_time, end_time } = req.body;
    const reserved_by = req.user.id;

    if (!equipment_id || !project_id || !start_time || !end_time) {
        return res.status(400).json({ message: "All fields are required" });
    }

    Reservation.createReservation(equipment_id, project_id, reserved_by, start_time, end_time, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.message) return res.status(409).json(result); // Conflict detected
        res.status(201).json({ message: "Reservation created successfully" });
    });
};

exports.getReservations = (req, res) => {
    Reservation.getReservations((err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
};
