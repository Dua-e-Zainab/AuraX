const express = require('express');
const UserData = require('../models/UserData');
const router = express.Router();

// Endpoint to receive and save user interaction data
router.post('/', async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log the incoming data

    const { sessionId, x, y, eventType, timestamp, os, device, browser, region, rageClicks, deadClicks, quickClicks, heatmapData } = req.body;

    // Check for required fields in the request body
    if (!sessionId || !x || !y || !eventType || !timestamp) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new instance of UserData and save it
    const userData = new UserData({
      sessionId,
      x,
      y,
      eventType,
      timestamp,
      os,
      device,
      browser,
      region,
      rageClicks,
      deadClicks,
      quickClicks,
      heatmapData // Save heatmap data
    });

    await userData.save(); // Save to MongoDB
    res.status(200).json({ message: 'Data received and saved' }); // Send success response
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).json({ message: 'Error saving data' }); // Send error response
  }
});

// Endpoint to fetch heatmap data for a specific session
router.get('/heatmap/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  try {
    const userData = await UserData.find({ sessionId });

    if (!userData || userData.length === 0) {
      return res.status(404).json({ success: false, message: "No data found." });
    }

    // Format data for heatmap.js
    const heatmapData = userData.map((entry) => ({
      x: entry.x,
      y: entry.y,
      intensity: entry.rageClicks || entry.quickClicks || 1, // Adjust intensity dynamically
    }));

    return res.json({ success: true, data: heatmapData });
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
