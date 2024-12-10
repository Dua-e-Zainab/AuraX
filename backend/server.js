const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project'); // Import the project routes

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // React app's origin
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Authorization' // Allowed headers
}));

app.use(express.json()); // Parse incoming JSON bodies

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/projects', projectRoutes); // Project routes

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
