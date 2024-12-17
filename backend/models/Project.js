// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    domain: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true, // Ensure each project has an owner
    },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
