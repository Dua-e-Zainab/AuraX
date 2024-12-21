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

        // Create and save the new project with the logged-in user as the owner
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

// GET route to fetch projects (authentication required)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;  // Get the user ID from the decoded JWT
        const projects = await Project.find({ owner: userId });

        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found.' });
        }
        res.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// DELETE route for deleting a project (authentication required)
router.delete('/:projectId', authenticateToken, async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id; // Get the user ID from the JWT token

    try {
        console.log(`Attempting to delete project with ID: ${projectId}`);

        const project = await Project.findById(projectId);

        if (!project) {
            console.log('Project not found');
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.owner.toString() !== userId) {
            console.log('User is not authorized to delete this project');
            return res.status(403).json({ message: 'You are not authorized to delete this project.' });
        }

        await Project.findByIdAndDelete(projectId); // Delete the project
        console.log('Project deleted successfully');
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Failed to delete project', error: error.message });
    }
});

// PUT route to update a project (authentication required)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, url, domain } = req.body;

    try {
        const project = await Project.findByIdAndUpdate(id, { name, url, domain }, { new: true });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router to be used in server.js
module.exports = router;
