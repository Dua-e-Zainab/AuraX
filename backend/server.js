const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project'); // Import the project routes
const authRoutes = require('./routes/auth'); // Make sure this path is correct

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

app.use(express.json());  // Parse incoming JSON bodies

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect to MongoDB:', err));

// Use authentication routes
app.use('/api/auth', authRoutes); // Authentication routes (login, register, etc.)

// Use project routes (these may or may not need authentication)
app.use('/api/projects', projectRoutes);
// Use the auth routes under '/api/auth'
app.use('/api/auth', authRoutes);  // Routes for login and signup

// Root route to test the server
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
