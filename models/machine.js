const db = require('../config/db');

const Machine = {
    addMachine: (id, powerRating, manufacturer, callback) => {
        const sql = 'INSERT INTO machines (id, power_rating, manufacturer) VALUES (?, ?, ?)';
        db.query(sql, [id, powerRating, manufacturer], callback);
    },

    getAllMachines: (callback) => {
        const sql = 'SELECT * FROM machines';
        db.query(sql, callback);
    }
};

module.exports = Machine;
