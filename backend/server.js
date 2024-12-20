const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// const { OAuth2Client } = require('google-auth-library'); // Import Google Auth Library
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const trackRoutes = require('./routes/track');

const authRoutes = require('./routes/auth');  // Import authentication routes
const projectRoutes = require('./routes/project');  // Import project routes
const trackRoutes = require('./routes/track');  // Import track routes


dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Google OAuth Client
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Make sure GOOGLE_CLIENT_ID is in your .env
const client = new OAuth2Client(CLIENT_ID);

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500/index.html'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Add OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json()); // Parse incoming JSON requests

// Explicitly handle preflight OPTIONS requests
app.options('*', cors()); // Allow OPTIONS for all routes

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); // Use the project routes with authentication
app.use('/api/track', trackRoutes);  // Use track routes (if needed)

// Add Google OAuth route
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body; // Receive token from frontend

  try {
    // Verify the token using Google OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload(); // Extract user details
    const { sub, email, name, picture } = payload;

    // Respond with the user information
    res.json({
      message: 'Google authentication successful',
      user: {
        id: sub,
        email,
        name,
        picture,
      },
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
