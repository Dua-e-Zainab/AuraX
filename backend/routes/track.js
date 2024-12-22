const express = require('express');
const UserData = require('../models/UserData');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Endpoint to save user interaction data for a specific project
router.post("/:projectId", async (req, res) => {
  console.log("Request Body:", req.body); 

  const {
    sessionId,
    x,
    y,
    eventType,
    timestamp,
    os,
    device,
    browser,
    rageClicks,
    deadClicks,
    quickClicks,
    intensity,
  } = req.body;

  try {
    const userData = new UserData({
      projectId: req.params.projectId,
      sessionId,
      x,
      y,
      eventType,
      timestamp,
      os,
      device,
      browser,
      rageClicks,
      deadClicks,
      quickClicks,
      intensity,
    });

    console.log("Data to be saved:", userData); 
    await userData.save();
    console.log("Data saved successfully:", userData); 
    res.status(201).json({ message: "Data saved successfully" });
  } catch (err) {
    console.error("Error saving user data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch heatmap data for a specific project (requires authentication)
router.get('/heatmap/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;

  try {
    console.log(`Fetching heatmap data for project ID: ${projectId}`);

    const userData = await UserData.find({ projectId });
    if (!userData || userData.length === 0) {
      console.log(`No data found for project ID: ${projectId}`);
      return res.status(404).json({ success: false, message: 'No data found for this project.' });
    }

    const heatmapData = userData.map((entry) => ({
      x: entry.x,
      y: entry.y,
      intensity: entry.intensity || 1,
    }));

    console.log(`Heatmap data fetched successfully for project ID: ${projectId}`);
    res.json({ success: true, data: heatmapData });
  } catch (error) {
    console.error('Error fetching heatmap data:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;