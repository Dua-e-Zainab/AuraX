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
app.use(cors()); // Allow cross-origin requests
app.use(express.json());  // Parse JSON request bodies

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to the MongoDB Atlas database');
}).catch((err) => {
    console.error('Database connection error:', err);
});

// Use authentication routes
app.use('/api/auth', authRoutes); // Authentication routes (login, register, etc.)

// Use project routes (these may or may not need authentication)
app.use('/api/projects', projectRoutes);

// Root route to test the server
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
