const express = require('express');
const mongoose = require('mongoose');
const Project = require('../models/Project'); // Project model
const router = express.Router();

// POST route for creating a new project (No authentication required)
router.post('/create', async (req, res) => {
    try {
        const { name, url, domain } = req.body;

        // Check if all fields are provided
        if (!name || !url || !domain) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check if a project with the same URL already exists (case-insensitive)
        const existingProject = await Project.findOne({ url: url.toLowerCase() });
        if (existingProject) {
            return res.status(400).json({ message: 'A project with this URL already exists.' });
        }

        // Create and save the new project
        const newProject = new Project({
            name,
            url: url.toLowerCase(), // Save URL in lowercase for uniformity
            domain,
        });

        const savedProject = await newProject.save(); // Save the project to the database
        res.status(201).json({ message: 'Project created successfully', project: savedProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET route to fetch all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find(); // Fetch all projects
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found.' });
        }
        res.json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// DELETE route to delete a project by ID
router.delete('/:projectId', async (req, res) => {
    const { projectId } = req.params; // Extract projectId from URL
    try {
        const project = await Project.findByIdAndDelete(projectId); // Query by _id
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Failed to delete project', error });
    }
});


module.exports = router;
