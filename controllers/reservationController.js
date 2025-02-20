const Reservation = require('../models/reservation');

exports.createReservation = (req, res) => {
    console.log("🔍 Received User:", req.user); // ✅ LOG USER INFO

    const { equipment_id, project_id, start_time, end_time } = req.body;
    const reserved_by = req.user?.id; // Ensure user exists before accessing ID

    if (!reserved_by) {
        return res.status(401).json({ message: "Unauthorized: User ID is missing." });
    }

    Reservation.createReservation(equipment_id, project_id, reserved_by, start_time, end_time, (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.status(201).json({ message: "Reservation created successfully", result });
    });
};


exports.getReservations = (req, res) => {
    console.log("📌 getReservations function called!");
    
    Reservation.getReservations((err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        res.json(results);
    });
};
