const express = require('express');
const Project = require('../models/Project');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Create a new project
router.post('/create', authenticateToken, async (req, res) => {
  const { name, url, domain } = req.body;
  const userId = req.user.id;

  try {
    if (!name || !url || !domain) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingProject = await Project.findOne({ url: url.toLowerCase() });
    if (existingProject) {
      return res.status(400).json({ message: 'A project with this URL already exists.' });
    }

    const newProject = new Project({
      name,
      url: url.toLowerCase(),
      domain,
      owner: userId,
    });

    const savedProject = await newProject.save();
    res.status(201).json({ message: 'Project created successfully', project: savedProject });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Fetch all projects for a user
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
