const db = require('../config/db');

const Asset = {
    // Transfer an asset to a new lab
    transferAsset: (equipmentId, fromLab, toLab, callback) => {
        const transferSql = `
            INSERT INTO asset_transfers (equipment_id, from_lab, to_lab) 
            VALUES (?, ?, ?)
        `;
        const updateSql = `
            UPDATE equipment SET current_lab = ? WHERE id = ?
        `;

        db.query(transferSql, [equipmentId, fromLab, toLab], (err) => {
            if (err) return callback(err);
            db.query(updateSql, [toLab, equipmentId], callback);
        });
    },

    // Get transfer history for an asset
    getAssetTransfers: (equipmentId, callback) => {
        const sql = `
            SELECT * FROM asset_transfers WHERE equipment_id = ? ORDER BY transfer_date DESC
        `;
        db.query(sql, [equipmentId], callback);
    }
};

module.exports = Asset;
