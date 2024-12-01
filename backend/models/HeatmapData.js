const mongoose = require('mongoose');

const heatmapDataSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    intensity: { type: Number, required: true }
});

const HeatmapData = mongoose.model('HeatmapData', heatmapDataSchema);

module.exports = HeatmapData;
