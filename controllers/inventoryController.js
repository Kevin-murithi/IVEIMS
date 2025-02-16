const Equipment = require('../models/equipment');

// Add new equipment
exports.addEquipment = (req, res) => {
    const { name, lab } = req.body;

    if (!name || !lab) {
        return res.status(400).json({ message: 'Name and lab are required' });
    }

    // Generate a unique barcode-like identifier
    const uniqueCode = `EQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    Equipment.addEquipment(name, lab, uniqueCode, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'Equipment added successfully', uniqueCode });
    });
};

// Get all equipment
exports.getAllEquipment = (req, res) => {
    Equipment.getAllEquipment((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};

// Update equipment status
exports.updateEquipmentStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'in use', 'maintenance'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    Equipment.updateEquipmentStatus(id, status, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Equipment status updated successfully' });
    });
};

// Delete equipment
exports.deleteEquipment = (req, res) => {
    const { id } = req.params;

    Equipment.deleteEquipment(id, (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Equipment deleted successfully' });
    });
};
