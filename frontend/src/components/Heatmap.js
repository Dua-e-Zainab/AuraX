import React, { useState, useEffect, useRef } from "react";
import h337 from "heatmap.js";
import Navbar2 from "./Navbar2";
import { useParams } from "react-router-dom";

const HeatmapPage = () => {
  const { projectId: paramProjectId } = useParams();
  const projectId = paramProjectId || localStorage.getItem("projectId");
  const [projectUrl, setProjectUrl] = useState("");
  const [heatmapData, setHeatmapData] = useState([]);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);
  const heatmapInstance = useRef(null);
  const [scrollY, setScrollY] = useState(0); 

  // Fetch project URL
  useEffect(() => {
    const fetchProjectUrl = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.success) {
          setProjectUrl(data.project.url);
        } else {
          console.error("Error fetching project URL:", data.message || "Not Found");
        }
      } catch (err) {
        console.error("Failed to fetch project URL:", err);
      }
    };

    fetchProjectUrl();
  }, [projectId]);

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      const storedProjectId = projectId || localStorage.getItem("projectId");
      if (!storedProjectId) {
        console.error("Project ID not found.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/track/heatmap/${storedProjectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching heatmap data: ${response.statusText}`);
        }

        const data = await response.json();
        const transformedData = data.data.map((point) => ({
          x: point.x,
          y: point.y,
          value: point.intensity,
        }));
        setHeatmapData(transformedData);
      } catch (error) {
        console.error("Error fetching heatmap data:", error.message);
      }
    };

    fetchHeatmapData();
  }, [projectId]);

  // Initialize heatmap
  useEffect(() => {
    if (!iframeLoaded || heatmapData.length === 0) return;
  
    const heatmapContainer = document.getElementById("heatmap-container");
    if (!heatmapContainer) {
      console.error("Heatmap container not found.");
      return;
    }
  
    if (!heatmapInstance.current) {
      heatmapInstance.current = h337.create({
        container: heatmapContainer,
        radius: 30,
        maxOpacity: 0.6,
        blur: 0.8,
        gradient: { 0.2: "blue", 0.5: "yellow", 1.0: "red" },
      });
    }
  
    const iframeRect = iframeRef.current?.getBoundingClientRect();
    if (!iframeRect) {
      console.error("Iframe dimensions not available.");
      return;
    }
  
    // Adjust heatmap data to account for scrolling
    heatmapInstance.current.setData({
      max: Math.max(...heatmapData.map((point) => point.value), 10),
      data: heatmapData.map((point) => ({
        x: point.x - iframeRect.left,
        y: point.y - iframeRect.top - scrollY, // Adjust for iframe scroll
        value: point.value,
      })),
    });
  
    console.log("Heatmap updated with scrolling:", { heatmapData, scrollY });
  }, [iframeLoaded, heatmapData, scrollY]);
  
  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (!projectUrl) return;
  
      const expectedOrigin = new URL(projectUrl).origin;
      if (event.origin !== expectedOrigin) return;
  
      const { type, scrollY } = event.data;
      if (type === "SCROLL_EVENT") {
        setScrollY(scrollY); // Update the scroll offset dynamically
      }
    };
  
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [projectUrl]);

  // Handle hover events on the heatmap
  const handleHeatmapHover = (e) => {
    const tooltip = document.getElementById("heatmap-tooltip");
    const heatmapContainer = document.getElementById("heatmap-container");
  
    if (!heatmapContainer || !heatmapInstance.current) return;
  
    const heatmapRect = heatmapContainer.getBoundingClientRect();
    const mouseX = e.clientX - heatmapRect.left;
    const mouseY = e.clientY - heatmapRect.top;
  
    const value = heatmapInstance.current.getValueAt({ x: mouseX, y: mouseY });
  
    if (value > 0) {
      tooltip.style.display = "block";
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
      tooltip.innerText = `Clicks: ${value}`;
    } else {
      tooltip.style.display = "none";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-blue-200 flex flex-col">
      {/* Navbar */}
      <Navbar2 />

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white border-r border-purple-400 p-5 shadow-lg rounded-lg">
          {/* Search Section */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border rounded-lg border-purple-300 focus:ring focus:ring-purple-400 text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Sidebar Links */}
          <ul className="space-y-2 text-purple-600">
            <li className="font-semibold mb-2 hover:text-purple-700 cursor-pointer">
              + New heatmap
            </li>
            <li className="font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-lg">
              Home Page
            </li>
            <li className="hover:text-purple-700 p-2 cursor-pointer">Returning users</li>
            <li className="hover:text-purple-700 p-2 cursor-pointer">Contact page</li>
            <li className="hover:text-purple-700 p-2 cursor-pointer">
              Products page - 10 days ago
            </li>
            <li className="hover:text-purple-700 p-2 cursor-pointer">
              Products page - 1 month ago
            </li>
            
          </ul>
          {/* Total Clicks */}
          <div className="mt-8 p-4 bg-purple-50 border border-purple-300 rounded-lg text-center">
            <p className="text-purple-700 font-black">Total Clicks</p>
            <p>{heatmapData.reduce((sum, point) => sum + point.value, 0)}</p>
          </div>
        </aside>

        {/* Heatmap Section */}
        <section className="w-3/4 relative p-2">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-3 mt-3">
            <h1
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-500"
            >
              AuraX | Heatmap
            </h1>
          </div>

          {/* Heatmap Container */}
          <div className="relative h-[calc(100vh-5rem)] rounded-lg border overflow-hidden shadow-lg">
            {/* Heatmap Layer */}
            <div
              id="heatmap-container"
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
              onMouseMove={(e) => handleHeatmapHover(e)}
            ></div>

            {/* Tooltip for displaying click details */}
            <div
              id="heatmap-tooltip"
              className="absolute bg-tooltipBg text-white text-xs rounded px-2 py-1 pointer-events-none hidden z-20 animate-fadeIn"
              style={{ display: "none" }}
            ></div>

            {/* Iframe for Project Content */}
            <iframe
          ref={iframeRef}
          src={projectUrl}
          className="w-full h-full absolute top-0 left-0 z-0"
          onLoad={() => setIframeLoaded(true)}
          sandbox="allow-same-origin allow-scripts"
        />
        <div
          id="heatmap-tooltip"
          className="absolute bg-black text-white text-xs rounded px-2 py-1 pointer-events-none hidden z-20">
          </div>
        </div>
        </section>
      </div>         
    </div>
  );
};

export default HeatmapPage;