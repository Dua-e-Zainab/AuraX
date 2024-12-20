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
    creatorID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to User
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true, // Ensure each project has an owner
    },
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
