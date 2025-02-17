const path = require('path');
const multer = require('multer');
const Documentation = require('../models/documentation');

// ✅ Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in 'uploads/' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    }
});

// ✅ Ensure Multer expects 'file' (not 'PDF')
const upload = multer({ storage: storage }).single('file'); // ✅ Accepts only one file under the key 'file'

exports.uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error("File Upload Error:", err);
            return res.status(500).json({ message: 'Error uploading file' });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { project_id } = req.body;
        const uploaded_by = req.user.id; // Logged-in user
        const file_name = req.file.filename;
        const file_path = path.join('uploads', req.file.filename);

        Documentation.uploadFile(project_id, file_name, file_path, uploaded_by, (err) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(201).json({ message: 'File uploaded successfully', file_name });
        });
    });
};

exports.getFilesByProject = (req, res) => {
    const { project_id } = req.params;
    Documentation.getFilesByProject(project_id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
};
