const Equipment = require('../models/equipment');
const Machine = require('../models/machine'); // Add Machine model

// Add new equipment or machine
exports.addEquipment = (req, res) => {
    const { name, lab, isMachine, powerRating, manufacturer, currentLocation } = req.body;

    if (!name || !lab || !currentLocation) {
        return res.status(400).json({ message: 'Name, lab, and location are required' });
    }

    const uniqueCode = `EQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    Equipment.addEquipment(name, lab, uniqueCode, currentLocation, 'available', (err, result) => {
        if (err) 
            
            {
                console.log(err)
                return res.status(500).json({ message: 'Database error' });}

        // If this is a machine, add machine details
        if (isMachine) {
            const equipmentId = result.insertId;
            Machine.addMachine(equipmentId, powerRating, manufacturer, (err) => {
                if (err) return res.status(500).json({ message: 'Machine insertion failed' });
                res.status(201).json({ message: 'Machine added successfully', uniqueCode });
            });
        } else {
            res.status(201).json({ message: 'Equipment added successfully', uniqueCode });
        }
    });
};

// Get all equipment (including machines)
exports.getAllEquipment = (req, res) => {
    Equipment.getAllEquipment((err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        Machine.getAllMachines((err, machineResults) => {
            if (err) return res.status(500).json({ message: 'Database error' });

            const combinedResults = results.map(eq => {
                const machineData = machineResults.find(m => m.id === eq.id);
                return machineData ? { ...eq, ...machineData } : eq;
            });

            res.json(combinedResults);
        });
    });
};

// Update equipment status & location
exports.updateEquipmentStatus = (req, res) => {
    const { id } = req.params;
    const { status, currentLocation } = req.body;

    if (!['available', 'in use', 'maintenance', 'damaged'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    Equipment.updateEquipmentStatus(id, status, currentLocation, (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Equipment status updated successfully' });
    });
};
