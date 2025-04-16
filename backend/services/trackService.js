const UserData = require("../models/UserData");

const saveUserData = async (projectId, data) => {
  const userData = new UserData({ projectId, ...data });
  await userData.save();
  return userData;
};

const fetchHeatmapData = async (projectId) => {
  const data = await UserData.find({ projectId });
  return data.map((entry) => ({
    x: entry.x,
    y: entry.y,
    intensity: entry.intensity || 1,
  }));
};

const getDashboardData = async (projectId) => {
  const sessions = await UserData.distinct("sessionId", { projectId });
  const totalClicks = await UserData.countDocuments({ projectId, eventType: "click" });
  const rageClicks = await UserData.countDocuments({ projectId, rageClicks: { $gt: 0 } });
  const deadClicks = await UserData.countDocuments({ projectId, deadClicks: { $gt: 0 } });
  const quickClicks = await UserData.countDocuments({ projectId, quickClicks: { $gt: 0 } });

  const osData = await UserData.aggregate([
    { $match: { projectId } },
    { $group: { _id: "$os", count: { $sum: 1 } } },
    { $project: { os: "$_id", count: 1, _id: 0 } }
  ]);

  const browserData = await UserData.aggregate([
    { $match: { projectId } },
    { $group: { _id: "$browser", count: { $sum: 1 } } },
    { $project: { browser: "$_id", count: 1, _id: 0 } }
  ]);

  const deviceData = await UserData.aggregate([
    { $match: { projectId } },
    { $group: { _id: "$device", count: { $sum: 1 } } },
    { $project: { device: "$_id", count: 1, _id: 0 } }
  ]);

  return {
    sessions: sessions.length,
    totalClicks,
    rageClicks,
    deadClicks,
    quickClicks,
    osData,
    browserData,
    deviceData
  };
};

module.exports = {
  saveUserData,
  fetchHeatmapData,
  getDashboardData
};
