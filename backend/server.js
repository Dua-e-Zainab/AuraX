const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');  // Import authentication routes
const projectRoutes = require('./routes/project');  // Import project routes
const trackRoutes = require('./routes/track');  // Import track routes

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5000'],
    methods: ['GET', 'POST', 'DELETE'],  // Ensure DELETE is allowed
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); // Parse incoming JSON requests

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Your API routes
const authRoutes = require('./routes/auth'); 
const projectRoutes = require('./routes/project');
const trackRoutes = require('./routes/track');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // Use the project routes with authentication
app.use('/api/track', trackRoutes);  // Use track routes (if needed)

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
