// models/MuseClick.js
const mongoose = require('mongoose');

const museClickSchema = new mongoose.Schema({
    name: String,
    role: String,
    x: Number, // Added x coordinate
    y: Number, // Added y coordinate
});

const MuseClick = mongoose.model('MuseClick', museClickSchema);
module.exports = MuseClick;
