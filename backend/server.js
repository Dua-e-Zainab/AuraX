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

// Middleware for CORS
app.use(cors({
    origin: [
        'http://127.0.0.1:5501',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5500',
        'http://localhost:5174',
        'https://nzxtsol.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
}));

app.options('*', cors());

// Middleware for setting Content-Security-Policy
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "frame-src 'self' http://127.0.0.1:5501 http://localhost:5173 http://localhost:3000 http://127.0.0.1:5500 http://localhost:5174 https://nzxtsol.com;"
    );
    next();
});

app.use(express.json());

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