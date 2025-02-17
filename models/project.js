const db = require('../config/db');

const Project = {
    getAllProjects: (callback) => {
        const sql = "SELECT * FROM projects";
        db.query(sql, callback);
    },

    createProject: (name, description, owner_id, callback) => {
        const sql = "INSERT INTO projects (name, description, owner_id) VALUES (?, ?, ?)";
        db.query(sql, [name, description, owner_id], callback);
    },

    updateProjectStatus: (id, status, callback) => {
        const sql = "UPDATE projects SET status = ? WHERE id = ?";
        db.query(sql, [status, id], callback);
    }
};

module.exports = Project;
