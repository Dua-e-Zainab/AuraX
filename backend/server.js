const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Define HeatmapData model
const HeatmapData = require('./models/HeatmapData'); // Assuming you create this model

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection URI
const mongoURI = 'mongodb+srv://hassaan19:2xopP83rB@aurax.idvo9.mongodb.net/users';

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// Endpoint to generate and save dummy coordinates to MongoDB
app.get('/api/heatmap', async (req, res) => {
    const coordinates = [];

    // Generate 100 random X, Y coordinates and save them to the database
    for (let i = 0; i < 100; i++) {
        const x = Math.floor(Math.random() * 500);  // Random X coordinate
        const y = Math.floor(Math.random() * 500);  // Random Y coordinate
        const intensity = Math.floor(Math.random() * 100) + 1;  // Random intensity between 1 and 100

        // Create a new coordinate document
        const newCoordinate = new HeatmapData({ x, y, intensity });

        // Save the coordinate to the database
        await newCoordinate.save();

        // Add it to the array to send to the frontend
        coordinates.push({ x, y, intensity });
    }

    // Send the generated coordinates as a JSON response
    res.json(coordinates);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
