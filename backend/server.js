
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
// const { OAuth2Client } = require('google-auth-library'); // Import Google Auth Library
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const trackRoutes = require('./routes/track');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Google OAuth Client
const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Ensure this is in your .env file
const client = new OAuth2Client(CLIENT_ID);

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',            // Your local React app
        'http://127.0.0.1:5500',           // Local file server (if using file-based approach)
        'https://nzxtsol.com',             // Allow external origin (your iframe site)
        'https://nzxtsol.com/aurax',       // Specific endpoint (if needed)
        'http://127.0.0.1:5501',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow all necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'],    // Allowed headers for CORS
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

app.use(express.json());

// Explicitly handle preflight OPTIONS requests (necessary for CORS)
app.options('*', cors()); // Allow OPTIONS for all routes

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/track', trackRoutes);

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
