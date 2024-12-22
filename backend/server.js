const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const trackRoutes = require('./routes/track');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5501/index.html', 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5174', 'https://nzxtsol.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

// Preflight OPTIONS Request Middleware
app.options('*', cors());

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/track', trackRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
