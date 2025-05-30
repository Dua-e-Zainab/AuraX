const express = require('express');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();
const mongoose = require('mongoose');

// Create a new project
router.post('/create', authenticateToken, async (req, res) => {
    const { name, url, domain } = req.body;
    const userId = req.user.id;

    try {
        // Validation: Ensure all fields are provided
        if (!name || !url || !domain) {
            return res.status(400).json({ message: 'All fields are required.' });
            console.log('Validation failed: Missing fields', { name, url, domain });
        }

        // Check for existing project with the same URL (case insensitive)
        const existingProjectByUrl = await Project.findOne({ 
            url: url.toLowerCase(),
            owner: userId
        });
        if (existingProjectByUrl) {
            return res.status(400).json({ message: 'Project with this URL already exists.' });
            console
        }

        // Check for existing project with the same name for this user
        const existingProjectByName = await Project.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }, // Case insensitive match
            owner: userId
        });
        if (existingProjectByName) {
            return res.status(400).json({ message: 'You already have a project with this name.' });
        }

        // Save the new project in the database
        const newProject = new Project({
            name,
            url: url.toLowerCase(),
            domain,
            owner: userId,
        });
        
        const savedProject = await newProject.save();

        // Tracking snippet for the user
        const trackingSnippet = `
        <script>
        (function () {
          const projectId = "${id}";
          const sessionId = (() => {
            let sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
              sessionId = 'sess-' + Math.random().toString(36).substr(2, 9);
              localStorage.setItem('sessionId', sessionId);
            }
            return sessionId;
          })();
    
          let rageClicks = 0, deadClicks = 0, quickClicks = 0;
          const clickTrackingData = {};
    
          const trackClickPerformance = (x, y) => {
            const key = \`\${Math.round(x)},\${Math.round(y)}\`;
            const currentTime = Date.now();
    
            const clickData = clickTrackingData[key] = clickTrackingData[key] || {
              clicks: 0,
              lastClickTime: 0,
              clickTimes: [],
              rageClicks: 0,
              deadClicks: 0,
              quickClicks: 0,
            };
    
            const timeSinceLastClick = currentTime - clickData.lastClickTime;
            if (timeSinceLastClick < 500) {
              clickData.rageClicks++;
              rageClicks++;
            }
    
            clickData.clickTimes.push(currentTime);
            clickData.clickTimes = clickData.clickTimes.filter(time => currentTime - time <= 2000);
            if (clickData.clickTimes.length > 2) {
              clickData.quickClicks++;
              quickClicks++;
            }
    
            const isClickOnActionableArea = (x, y) => {
              const { innerWidth, innerHeight } = window;
              const clickableArea = {
                x: innerWidth / 3,
                y: innerHeight / 3,
                width: innerWidth / 3,
                height: innerHeight / 3,
              };
              return (
                x > clickableArea.x && x < clickableArea.x + clickableArea.width &&
                y > clickableArea.y && y < clickableArea.y + clickableArea.height
              );
            };
    
            if (!isClickOnActionableArea(x, y)) {
              clickData.deadClicks++;
              deadClicks++;
            }
    
            clickData.lastClickTime = currentTime;
            clickData.clicks++;
          };
    
          document.addEventListener('click', (event) => {
            const x = event.pageX;
            const y = event.pageY;
    
            trackClickPerformance(x, y);
    
            const getBrowser = () => {
              const ua = navigator.userAgent;
              if (/Edg\\//.test(ua)) return "Edge";
              if (/Chrome\\//.test(ua) && !/Edg\\//.test(ua)) return "Chrome";
              if (/Firefox\\//.test(ua)) return "Firefox";
              if (/Safari\\//.test(ua) && !/Chrome\\//.test(ua)) return "Safari";
              if (/Opera|OPR\\//.test(ua)) return "Opera";
              return "Unknown";
            };
    
            const getDeviceType = () => {
              const ua = navigator.userAgent;
              if (/Tablet|iPad/i.test(ua)) return "Tablet";
              if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
              return "Desktop";
            };
    
            fetch(\`http://localhost:5000/api/track/\${projectId}\`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                projectId,
                sessionId,
                x,
                y,
                eventType: "click",
                timestamp: new Date().toISOString(),
                os: navigator.platform,
                browser: getBrowser(),
                device: getDeviceType(),
                rageClicks,
                deadClicks,
                quickClicks,
                intensity: 1,
                page: window.location.pathname, // Add page tracking
              }),
            }).then(response => {
              if (response.ok) {
                console.log("Data sent successfully:", { x, y });
              } else {
                console.error("Failed to send data:", response.status);
              }
            }).catch(error => console.error("Error sending data:", error));
          });
    
          window.addEventListener("scroll", () => {
            parent.postMessage(
              {
                type: "SCROLL_EVENT",
                scrollX: window.scrollX,
                scrollY: window.scrollY,
              },
              "*"
            );
          });
        })();
      </script>
        `;
        
        res.status(201).json({
          message: 'Project created successfully',
          project: savedProject,
          trackingCode: trackingSnippet, 
        });
          
    } catch (error) {
        console.error('Error creating project:', error);
        
        // Handle duplicate key errors (though our checks should prevent them)
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Project with this name or URL already exists.' 
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: error.errors 
            });
        }
        
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
});

// GET route to fetch all projects for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Find all projects created by the logged-in user
        const projects = await Project.find({ owner: userId });

        res.status(200).json({ 
            success: true, 
            projects: projects || [] // Return empty array if no projects
        });
    } catch (error) {
        console.error('Error fetching user projects:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching projects.' 
        });
    }
});

// GET route to fetch a specific project by its ID for the authenticated user
router.get('/:projectId', authenticateToken, async (req, res) => {
    const { projectId } = req.params;

    try {
        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid project ID format.' 
            });
        }

        const userId = req.user.id;
        const project = await Project.findOne({ 
            _id: projectId, 
            owner: userId 
        });

        if (!project) {
            return res.status(404).json({ 
                success: false, 
                message: 'Project not found or unauthorized access.' 
            });
        }

        res.status(200).json({ 
            success: true, 
            project 
        });
    } catch (error) {
        console.error('Error fetching the project:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error while fetching project.' 
        });
    }
});

// DELETE route for deleting a project
router.delete('/:projectId', authenticateToken, async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;

    try {
        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ 
                message: 'Invalid project ID format.' 
            });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ 
                message: 'Project not found' 
            });
        }

        if (project.owner.toString() !== userId) {
            return res.status(403).json({ 
                message: 'Unauthorized to delete this project.' 
            });
        }

        await Project.findByIdAndDelete(projectId);
        res.status(200).json({ 
            message: 'Project deleted successfully.' 
        });
    } catch (error) {
        console.error('Error deleting project:', error.message);
        res.status(500).json({ 
            message: 'Server error while deleting project.', 
            error: error.message 
        });
    }
});

// Update a project
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, url, domain } = req.body;

    try {
        // Validate project ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                message: 'Invalid project ID format' 
            });
        }

        // Check if the project exists
        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ 
                message: 'Project not found.' 
            });
        }

        // Check ownership
        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ 
                message: 'Unauthorized to update this project.' 
            });
        }

        // Check if new name conflicts with another project of the same user
        if (name && name !== project.name) {
            const existingProject = await Project.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                owner: req.user.id,
                _id: { $ne: id } // Exclude current project from the check
            });
            
            if (existingProject) {
                return res.status(400).json({ 
                    message: 'You already have another project with this name.' 
                });
            }
        }

        // Check if new URL conflicts with another project of the same user
        if (url && url.toLowerCase() !== project.url) {
            const existingProject = await Project.findOne({
                url: url.toLowerCase(),
                owner: req.user.id,
                _id: { $ne: id } // Exclude current project from the check
            });
            
            if (existingProject) {
                return res.status(400).json({ 
                    message: 'You already have another project with this URL.' 
                });
            }
        }

        // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { 
                name: name || project.name,
                url: url ? url.toLowerCase() : project.url,
                domain: domain || project.domain
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ 
            message: 'Project updated successfully.', 
            project: updatedProject 
        });
    } catch (error) {
        console.error('Error updating project:', error.message);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Project with this name or URL already exists.' 
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation failed.',
                errors: error.errors 
            });
        }
        
        res.status(500).json({ 
            message: 'Server error while updating project.', 
            error: error.message 
        });
    }
});

module.exports = router;