const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  sessionId: String,
  x: Number,
  y: Number,
  eventType: String,
  timestamp: String,
  os: String,
  device: String,
  browser: String,
  region: String,
  rageClicks: Number,
  deadClicks: Number,
  quickClicks: Number,
  heatmapData: [{ // Array of heatmap data points
    x: Number,
    y: Number,
    intensity: Number
  }]
});

module.exports = mongoose.model('UserData', userDataSchema);