const mongoose = require("mongoose");

const UserDataSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  sessionId: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  eventType: { type: String, required: true },
  timestamp: { type: Date, required: true },
  os: { type: String },
  browser: { type: String },
  device: { type: String },
  country: { type: String, default: "Unknown" },
  rageClicks: { type: Number, default: 0 },
  deadClicks: { type: Number, default: 0 },
  quickClicks: { type: Number, default: 0 },
  intensity: { type: Number, default: 1 },
  page: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("UserData", UserDataSchema);