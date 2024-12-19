const jwt = require('jsonwebtoken');

// Middleware to authenticate using a JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authentication required.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user; // Add user data to the request object
        next();
    });
};

// Protect your routes with this middleware
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { name, url, domain } = req.body;
        if (!name || !url || !domain) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingProject = await Project.findOne({ url: url.toLowerCase() });
        if (existingProject) {
            return res.status(400).json({ message: 'A project with this URL already exists.' });
        }

        const newProject = new Project({
            name,
            url: url.toLowerCase(),
            domain,
        });

        const savedProject = await newProject.save();
        res.status(201).json({ message: 'Project created successfully', project: savedProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
