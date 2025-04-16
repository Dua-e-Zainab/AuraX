const trackService = require("../services/trackService");

const saveUserInteraction = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userData = await trackService.saveUserData(projectId, req.body);
    res.status(201).json({ message: "Data saved successfully", userData });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({ message: "Server error." });
  }
};

const getHeatmapData = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const data = await trackService.fetchHeatmapData(projectId);
    if (!data.length) {
      return res.status(404).json({ success: false, message: "No data found for this project." });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Heatmap fetch error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

const getDashboardMetrics = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const metrics = await trackService.getDashboardData(projectId);
    const { sessions, totalClicks, rageClicks, deadClicks, quickClicks, osData, browserData, deviceData } = metrics;

    res.json({
      success: true,
      metrics: [
        { title: "Sessions", value: sessions },
        { title: "Total Clicks", value: totalClicks }
      ],
      insights: [
        { label: "Rage Clicks", value: `${((rageClicks / totalClicks) * 100 || 0).toFixed(2)}%` },
        { label: "Dead Clicks", value: `${((deadClicks / totalClicks) * 100 || 0).toFixed(2)}%` },
        { label: "Quick Clicks", value: `${((quickClicks / totalClicks) * 100 || 0).toFixed(2)}%` }
      ],
      distributions: {
        os: osData,
        browsers: browserData,
        devices: deviceData
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  saveUserInteraction,
  getHeatmapData,
  getDashboardMetrics
};
