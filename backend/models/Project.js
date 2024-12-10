const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        unique: true, // Ensure URL is unique
    },
    domain: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
