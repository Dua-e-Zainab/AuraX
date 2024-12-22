const express = require('express');
const Project = require('../models/Project');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

// POST route for creating a new project (authentication required)
router.post('/create', authenticateToken, async (req, res) => {
    const { name, url, domain } = req.body;
    const userId = req.user.id; 

    try {
        // Validation: Ensure all fields are provided
        if (!name || !url || !domain) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Check for existing project with the same URL
        const existingProject = await Project.findOne({ url: url.toLowerCase() });
        if (existingProject) {
            return res.status(400).json({ message: 'Project with this URL already exists.' });
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
            const projectId = "${savedProject._id}"; // Dynamically inject the actual project ID
            const sessionId = (() => {
              let sessionId = localStorage.getItem('sessionId');
              if (!sessionId) {
                sessionId = \`sess-\${Math.random().toString(36).substr(2, 9)}\`;
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
        
              fetch(\`http://localhost:5000/api/track/\${projectId}\`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  projectId,
                  sessionId: (() => {
                    let sessionId = localStorage.getItem("sessionId");
                    if (!sessionId) {
                      sessionId = "sess-${Math.random().toString(36).slice(2, 11)}";
                      localStorage.setItem("sessionId", sessionId);
                    }
                    return sessionId;
                  })(),
                  x,
                  y,
                  eventType: "click",
                  timestamp: new Date().toISOString(),
                  os: navigator.platform, 
                  browser: navigator.userAgent,
                  device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
                  rageClicks,
                  deadClicks,
                  quickClicks,
                  intensity: 1,
                }),
              })
                .then(response => {
                if (response.ok) {
                  console.log("Data sent successfully:", { x, y });
                } else {
                  console.error("Failed to send data:", response.status);
                }
              }).catch(error => console.error("Error sending data:", error));
            });

            // Track iframe scroll events and notify parent
            window.addEventListener("scroll", () => {
              parent.postMessage(
                {
                  type: "SCROLL_EVENT",
                  scrollX: window.scrollX, 
                  scrollY: window.scrollY, // Current vertical scroll position
                },
                "*" // Replace "*" with the parent's origin for security
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
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });


// GET route to fetch all projects for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
      const userId = req.user.id; 
      
      // Find all projects created by the logged-in user
      const projects = await Project.find({ owner: userId });

      if (!projects.length) {
          return res.status(404).json({ success: false, message: 'No projects found for this user.' });
      }

      res.status(200).json({ success: true, projects });
  } catch (error) {
      console.error('Error fetching user projects:', error.message);
      res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET route to fetch a specific project by its ID for the authenticated user
router.get('/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;

  try {
      const userId = req.user.id;

      // Find the project by ID and ensure it belongs to the logged-in user
      const project = await Project.findOne({ _id: projectId, owner: userId });

      if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found or unauthorized access.' });
      }

      res.status(200).json({ success: true, project });
  } catch (error) {
      console.error('Error fetching the project:', error.message);
      res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// DELETE route for deleting a project (authentication required)
router.delete('/:projectId', authenticateToken, async (req, res) => {
  const { projectId } = req.params;
  const userId = req.user.id; 

  try {
      // Find the project by ID
      const project = await Project.findById(projectId);

      if (!project) {
          return res.status(404).json({ message: 'Project not found' });
      }

      // Ensure the logged-in user is the project owner
      if (project.owner.toString() !== userId) {
          return res.status(403).json({ message: 'You are not authorized to delete this project.' });
      }

      // Delete the project
      await Project.findByIdAndDelete(projectId);
      res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
      console.error('Error deleting project:', error.message);
      res.status(500).json({ message: 'Failed to delete project', error: error.message });
  }
});

const mongoose = require('mongoose');

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name, url, domain } = req.body;

    try {
        console.log('Received PUT request for Project ID:', id);

        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log('Invalid Project ID format');
            return res.status(400).json({ message: 'Invalid project ID format' });
        }

        // Check if the project exists
        const project = await Project.findById(id);
        if (!project) {
            console.log('Project not found with ID:', id);
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership
        console.log('Logged-in User ID:', req.user.id);
        console.log('Project Owner ID:', project.owner.toString());

        if (project.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized to update this project' });
        }

        // Update project
        const updatedProject = await Project.findByIdAndUpdate(
            id,
            { name, url, domain },
            { new: true, runValidators: true }
        );

        console.log('Project updated successfully:', updatedProject);
        res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
    } catch (error) {
        console.error('Error updating project:', error.message);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;