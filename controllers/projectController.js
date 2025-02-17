const Project = require('../models/project');

exports.getProjects = (req, res) => {
    Project.getAllProjects((err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(results);
    });
};

exports.createProject = (req, res) => {
    const { name, description } = req.body;
    const owner_id = req.user.id; // Owner is the logged-in user

    if (!name || !description) return res.status(400).json({ message: "Project name and description are required" });

    Project.createProject(name, description, owner_id, (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(201).json({ message: "Project created successfully" });
    });
};

exports.updateProjectStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'active', 'completed'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    Project.updateProjectStatus(id, status, (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Project status updated successfully" });
    });
};
