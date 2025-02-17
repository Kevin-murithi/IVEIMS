const db = require('../config/db');

const Documentation = {
    uploadFile: (project_id, file_name, file_path, uploaded_by, callback) => {
        const sql = "INSERT INTO project_files (project_id, file_name, file_path, uploaded_by) VALUES (?, ?, ?, ?)";
        db.query(sql, [project_id, file_name, file_path, uploaded_by], callback);
    },

    getFilesByProject: (project_id, callback) => {
        const sql = "SELECT id, file_name, file_path, uploaded_at FROM project_files WHERE project_id = ?";
        db.query(sql, [project_id], callback);
    }
};

module.exports = Documentation;
