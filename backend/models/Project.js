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
    owner: { // Reference to the User model for the owner of the project
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
