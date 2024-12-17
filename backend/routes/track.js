const express = require('express');
const UserData = require('../models/UserData');
const router = express.Router();

// Endpoint to receive and save user interaction data
router.post('/', async (req, res) => {
  try {
    console.log("Received data:", req.body); // Log the incoming data

    const { sessionId, x, y, eventType, timestamp, os, device, browser, region, rageClicks, deadClicks, quickClicks, heatmapData } = req.body;

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


module.exports = router;
