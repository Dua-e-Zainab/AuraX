const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const trackRoutes = require('./routes/track');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/track', trackRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://hassaan19:2xopP83rB@aurax.idvo9.mongodb.net/myDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
   
}).then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;
