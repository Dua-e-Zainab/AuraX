const express = require('express');
const UserData = require('../models/UserData');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
const { UAParser } = require("ua-parser-js");
const mongoose = require("mongoose"); // <-- add this line



// Endpoint to save user interaction data for a specific project
router.post("/:projectId", async (req, res) => {
  console.log("Request Body:", req.body); 
  
  
  try {
    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();
    console.log("Parsed User-Agent:", ua);

    const os = ua.os.name || "Unknown";
    const browser = ua.browser.name || "Unknown";
    const device = ua.device.type ? ua.device.type : "desktop";

    const {
      sessionId,
      x,
      y,
      eventType,
      timestamp,
      rageClicks,
      deadClicks,
      quickClicks,
      intensity,
    } = req.body;

    const userData = new UserData({
      projectId: req.params.projectId,
      sessionId,
      x,
      y,
      eventType,
      timestamp,
      os,
      browser,
      device,
      rageClicks,
      deadClicks,
      quickClicks,
      intensity,
    });

    await userData.save();
    res.status(201).json({ message: "Data saved successfully" });

  } catch (err) {
    console.error("Error saving tracked data:", err.message);
    res.status(500).json({ message: "Internal server error" });
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
    const objectProjectId = new mongoose.Types.ObjectId(projectId); // ✅ convert to ObjectId

    // Now use objectProjectId in all queries
    const sessions = await UserData.distinct("sessionId", { projectId: objectProjectId });
    const sessionCount = sessions.length;

    const totalClicks = await UserData.countDocuments({ projectId: objectProjectId, eventType: "click" });

    const [rageClicks, deadClicks, quickClicks] = await Promise.all([
      UserData.countDocuments({ projectId: objectProjectId, rageClicks: { $gt: 0 } }),
      UserData.countDocuments({ projectId: objectProjectId, deadClicks: { $gt: 0 } }),
      UserData.countDocuments({ projectId: objectProjectId, quickClicks: { $gt: 0 } }),
    ]);

    const browserCount = await UserData.aggregate([
      { $match: { projectId: objectProjectId } }, // ✅ use objectProjectId here too
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $project: { browser: "$_id", count: 1, _id: 0 } },
    ]);

    const osCount = await UserData.aggregate([
      { $match: { projectId: objectProjectId } },
      { $group: { _id: "$os", count: { $sum: 1 } } },
      { $project: { os: "$_id", count: 1, _id: 0 } },
    ]);

    const deviceCount = await UserData.aggregate([
      { $match: { projectId: objectProjectId } },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $project: { device: "$_id", count: 1, _id: 0 } },
    ]);

    res.json({
      success: true,
      metrics: [
        { title: "Sessions", value: sessionCount },
        { title: "Total Clicks", value: totalClicks },
      ],
      insights: [
        { label: "Rage Clicks", value: totalClicks > 0 ? `${((rageClicks / totalClicks) * 100).toFixed(2)}%` : "0%" },
        { label: "Dead Clicks", value: totalClicks > 0 ? `${((deadClicks / totalClicks) * 100).toFixed(2)}%` : "0%" },
        { label: "Quick Clicks", value: totalClicks > 0 ? `${((quickClicks / totalClicks) * 100).toFixed(2)}%` : "0%" },
      ],
      distributions: {
        browsers: browserCount,
        os: osCount,
        devices: deviceCount,
      },
    });

  } catch (error) {
    console.error("Error in /dashboard route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;