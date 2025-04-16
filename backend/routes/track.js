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

// Dashboard Data Aggregation Endpoint
router.get('/dashboard/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;

  try {
    console.log("Received projectId:", projectId);

    // Sessions
    const sessions = await UserData.distinct("sessionId", { projectId });

    // Total Clicks
    const totalClicks = await UserData.countDocuments({ projectId, eventType: "click" });

    // Rage Clicks
    const rageClicks = await UserData.countDocuments({ projectId, rageClicks: { $gt: 0 } });

    // Dead Clicks
    const deadClicks = await UserData.countDocuments({ projectId, deadClicks: { $gt: 0 } });

    // Quick Clicks
    const quickClicks = await UserData.countDocuments({ projectId, quickClicks: { $gt: 0 } });

    // OS Distribution
    const osData = await UserData.aggregate([
      { $match: { projectId } },
      { $group: { _id: "$os", count: { $sum: 1 } } },
      { $project: { os: "$_id", count: 1, _id: 0 } }
    ]);

    // Browser Distribution
    const browserData = await UserData.aggregate([
      { $match: { projectId } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $project: { browser: "$_id", count: 1, _id: 0 } }
    ]);

    // Device Distribution
    const deviceData = await UserData.aggregate([
      { $match: { projectId } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $project: { device: "$_id", count: 1, _id: 0 } }
    ]);

    // Return aggregated data
    res.json({
      success: true,
      metrics: [
        { title: "Sessions", value: sessions.length, note: "" },
        { title: "Total Clicks", value: totalClicks, note: "" }
      ],
      insights: [
        { label: "Rage Clicks", value: `${((rageClicks / totalClicks) * 100).toFixed(2)}%` },
        { label: "Dead Clicks", value: `${((deadClicks / totalClicks) * 100).toFixed(2)}%` },
        { label: "Quick Clicks", value: `${((quickClicks / totalClicks) * 100).toFixed(2)}%` }
      ],
      distributions: {
        os: osData,
        browsers: browserData,
        devices: deviceData
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;