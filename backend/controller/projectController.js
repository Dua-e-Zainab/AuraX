const projectService = require('../services/projectService');
const mongoose = require('mongoose');

exports.createProject = async (req, res) => {
  const { name, url, domain } = req.body;
  const userId = req.user.id; // Get user ID from the token

  try {
    if (!name || !url || !domain) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if a project with this URL exists for the user
    const existingURL = await projectService.getProjectByUrl(url);
    if (existingURL) {
      return res.status(400).json({ message: 'Project with this URL already exists.' });
    }

    // Check if a project with the same name exists for the user
    const existingName = await projectService.getProjectByNameAndOwner(name, userId);
    if (existingName) {
      return res.status(400).json({ message: 'You already have a project with this name.' });
    }

    // Create the new project
    const newProject = await projectService.createProject({
      name,
      url: url.toLowerCase(),
      domain,
      owner: userId
    });

    // Generate a tracking snippet for the project
    const snippet = `/* tracking snippet with projectId ${newProject._id} */`;

    res.status(201).json({ message: 'Project created', project: newProject, trackingCode: snippet });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    const projects = await projectService.getAllProjectsByOwner(userId);
    if (!projects.length) {
      return res.status(404).json({ message: 'No projects found.' });
    }
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id; // Get user ID from token
    const project = await projectService.getProjectByIdAndOwner(projectId, userId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found or unauthorized.' });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, url, domain } = req.body;

  // Validate the project ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid project ID format' });
  }

  // Validate the required fields
  if (!name || !url || !domain) {
    return res.status(400).json({ message: 'All fields (name, url, domain) are required for update.' });
  }

  try {
    const project = await projectService.getProjectByIdAndOwner(id, req.user.id);
    if (!project) {
      return res.status(403).json({ message: 'Unauthorized to update this project' });
    }

    const updated = await projectService.updateProjectById(id, { name, url, domain });
    res.status(200).json({ message: 'Project updated', project: updated });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectService.getProjectByIdAndOwner(projectId, req.user.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await projectService.deleteProjectById(projectId);
    res.status(200).json({ message: 'Project deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
