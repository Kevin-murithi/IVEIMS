const Asset = require('../models/asset');
const Equipment = require('../models/equipment');
const db = require('../config/db.js');


exports.transferAsset = (req, res) => {
    const { equipmentId, toLab } = req.body;

    if (!equipmentId || !toLab) {
        return res.status(400).json({ message: 'Equipment ID and destination lab are required' });
    }

    console.log(`Transferring asset ID ${equipmentId} to ${toLab}`);

    // ✅ Fetch the equipment details
    const sql = 'SELECT id, current_lab FROM equipment WHERE id = ?';

    db.query(sql, [equipmentId], (err, results) => {
        if (err) {
            console.error("Database error (getEquipmentById):", err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Equipment not found' });
        }

        const fromLab = results[0].current_lab; // ✅ Ensure we get the current lab

        console.log(`Equipment ID ${equipmentId} is currently in: ${fromLab}`);

        if (!fromLab) {
            return res.status(500).json({ message: 'Current lab not found for this equipment' });
        }

        // ✅ Proceed with the transfer
        const transferSql = 'INSERT INTO asset_transfers (equipment_id, from_lab, to_lab) VALUES (?, ?, ?)';
        const updateSql = 'UPDATE equipment SET current_lab = ? WHERE id = ?';

        db.query(transferSql, [equipmentId, fromLab, toLab], (err) => {
            if (err) {
                console.error("Database error (transferAsset):", err);
                return res.status(500).json({ message: 'Error transferring asset' });
            }

            db.query(updateSql, [toLab, equipmentId], (err) => {
                if (err) {
                    console.error("Database error (updateAssetLab):", err);
                    return res.status(500).json({ message: 'Error updating asset lab' });
                }

                res.json({ message: `Asset moved from ${fromLab} to ${toLab}` });
            });
        });
    });
};



// Get asset transfer history
exports.getAssetTransfers = (req, res) => {
    const { equipmentId } = req.params;

    Asset.getAssetTransfers(equipmentId, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        res.json(results);
    });
};
