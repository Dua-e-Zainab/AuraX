const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const MuseClick = require('./models/museclicks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  };
  app.use(cors(corsOptions));
  
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('MongoDB connection error:', error));

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Server!');
});

// API route to fetch all documents from the `museclicks` collection
app.get('/api/museclicks', async (req, res) => {
    try {
        const museClicks = await MuseClick.find();
        res.json(museClicks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error });
    }
});

// API route to save a click
app.post('/api/museclicks', async (req, res) => {
    try {
        const { x, y } = req.body;
        const newClick = new MuseClick({ x, y });
        await newClick.save();
        res.status(201).json({ message: 'Coordinates saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving data', error });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
