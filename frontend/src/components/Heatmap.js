import React, { useState, useEffect } from 'react';
import axios from 'axios';
import heatmap from 'heatmap.js';  // Assuming you've installed and set up heatmap.js

const Heatmap = () => {
  const [coordinates, setCoordinates] = useState([]);

  // Fetch coordinates from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/heatmap')
      .then(response => {
        setCoordinates(response.data);
        createHeatmap(response.data); 
      })
      .catch(error => {
        console.error('Error fetching heatmap data:', error);
      });
  }, []);

  const createHeatmap = (data) => {
    // Set up heatmap.js container
    const heatmapInstance = heatmap.create({
      container: document.querySelector('.heatmap-container')
    });

    // Convert coordinates into the format heatmap.js expects
    const heatmapData = {
      max: 100,  // Maximum intensity (adjust this value if needed)
      data: data.map(coord => ({
        x: coord.x,
        y: coord.y,
        value: coord.intensity
      }))
    };

    // Set the heatmap data
    heatmapInstance.setData(heatmapData);
  };

  return (
    <div>
      <h2>Heatmap</h2>
      <div className="heatmap-container" style={{ width: '500px', height: '500px', position: 'relative' }}>
        {/* Heatmap will be rendered here */}
      </div>
    </div>
  );
};

export default Heatmap;
