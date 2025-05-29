const express = require('express');
const UserData = require('../models/UserData');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
const { UAParser } = require("ua-parser-js");
const mongoose = require("mongoose");

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
      page, // Add page to destructuring
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
      page, // Store page information
    });

    await userData.save();
    res.status(201).json({ message: "Data saved successfully" });

  } catch (err) {
    console.error("Error saving tracked data:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Fetch heatmap data for a specific project with time filtering (requires authentication)
// Fetch heatmap data for a specific project with time filtering (requires authentication)
router.get('/heatmap/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    console.log(`Fetching heatmap data for project ID: ${projectId}`);
    console.log('Query params:', { startDate, endDate });
    
    // Build the query filters
    const filters = { projectId };

    // Add date range filtering if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      console.log('Date range:', { start, end });
      
      filters.timestamp = {
        $gte: start,
        $lte: end
      };
    }

    console.log('Applied filters:', filters);

    const userData = await UserData.find(filters).sort({ timestamp: -1 });
    
    console.log(`Found ${userData.length} records`);
    console.log('Sample timestamps:', userData.slice(0, 3).map(d => d.timestamp));
    
    if (!userData || userData.length === 0) {
      console.log(`No data found for project ID: ${projectId}`);
      return res.status(404).json({ 
        success: false, 
        message: 'No data found for this project.' 
      });
    }

    const heatmapData = userData.map((entry) => ({
      x: entry.x,
      y: entry.y,
      intensity: entry.intensity || 1,
      page: entry.page,
      timestamp: entry.timestamp
    }));

    // Simple stats calculation
    const stats = {
      totalInteractions: heatmapData.length,
      dateRange: {
        from: startDate || 'All time',
        to: endDate || 'Now'
      },
      firstInteraction: userData[userData.length - 1]?.timestamp,
      lastInteraction: userData[0]?.timestamp
    };

    console.log(`Heatmap data fetched successfully. Found ${heatmapData.length} data points`);
    
    res.json({ 
      success: true, 
      data: heatmapData,
      stats: stats
    });
    
  } catch (error) {
    console.error('Error fetching heatmap data:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Dashboard Data Aggregation Endpoint
router.get('/dashboard/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;

  try {
    const objectProjectId = new mongoose.Types.ObjectId(projectId);

    // Basic metrics
    const sessions = await UserData.distinct("sessionId", { projectId: objectProjectId });
    const sessionCount = sessions.length;
    const totalClicks = await UserData.countDocuments({ projectId: objectProjectId, eventType: "click" });

    // Click insights
    const [rageClicks, deadClicks, quickClicks] = await Promise.all([
      UserData.countDocuments({ projectId: objectProjectId, rageClicks: { $gt: 0 } }),
      UserData.countDocuments({ projectId: objectProjectId, deadClicks: { $gt: 0 } }),
      UserData.countDocuments({ projectId: objectProjectId, quickClicks: { $gt: 0 } }),
    ]);

    // Distribution metrics
    const browserCount = await UserData.aggregate([
      { $match: { projectId: objectProjectId } },
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

    // Page-wise session counts (Smart Events)
    const pageSessionCounts = await UserData.aggregate([
      { $match: { projectId: objectProjectId } },
      { 
        $group: { 
          _id: { page: "$page", sessionId: "$sessionId" } 
        }
      },
      {
        $group: {
          _id: "$_id.page",
          sessionCount: { $sum: 1 }
        }
      },
      { $project: { page: "$_id", sessionCount: 1, _id: 0 } },
      { $sort: { sessionCount: -1 } },
      { $limit: 10 } // Return top 10 pages by session count
    ]);

    // Country distribution
    const countryCount = await UserData.aggregate([
      { $match: { projectId: objectProjectId } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $project: { country: "$_id", count: 1, _id: 0 } },
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
        countries: countryCount,
      },
      pageData: pageSessionCounts, // New field for Smart Events
    });

  } catch (error) {
    console.error("Error in /dashboard route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;