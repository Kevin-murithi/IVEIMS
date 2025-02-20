const db = require('../config/db');

function formatDate(date) {
    if (!date || isNaN(new Date(date).getTime())) {
        return null;
    }
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}

const Project = {
    getAllProjects: (callback) => {
        const sql = "SELECT * FROM projects";
        db.query(sql, callback);
    },

    createProject: (name, description, owner_id, start_date, end_date, status, callback) => {
        console.log("Creating Project with:", { name, description, owner_id, start_date, end_date, status });
    
        const sql = "INSERT INTO projects (name, description, owner_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?)";
        const params = [
            name ? name.toString() : null,
            description ? description.toString() : null,
            owner_id ? Number(owner_id) : null, 
            formatDate(start_date),
            formatDate(end_date),
            status ? status.toString() : null
        ];
    
        db.query(sql, params, callback);
    },
    
    
    updateProjectStatus: (id, status, callback) => {
        const sql = "UPDATE projects SET status = ? WHERE id = ?";
        db.query(sql, [status, id], callback);
    }
};

module.exports = Project;
