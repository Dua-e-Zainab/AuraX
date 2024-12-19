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
    creatorID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` fields


const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
