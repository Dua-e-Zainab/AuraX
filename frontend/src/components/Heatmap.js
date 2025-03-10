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
  const [iframeWidth, setIframeWidth] = useState("100%"); // Default iframe width

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
      if (!projectId) {
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
          `http://localhost:5000/api/track/heatmap/${projectId}`,
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

    heatmapInstance.current.setData({
      max: Math.max(...heatmapData.map((point) => point.value), 10),
      data: heatmapData.map((point) => ({
        x: point.x,
        y: point.y - scrollY, // Adjust for iframe scroll
        value: point.value,
      })),
    });
  }, [iframeLoaded, heatmapData, scrollY]);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (!projectUrl) return;

      const expectedOrigin = new URL(projectUrl).origin;
      if (event.origin !== expectedOrigin) return;

      const { type, scrollY, contentWidth } = event.data;
      if (type === "SCROLL_EVENT") {
        setScrollY(scrollY); // Update the scroll offset dynamically
      }
      if (type === "CONTENT_WIDTH") {
        setIframeWidth(`${contentWidth}px`); // Adjust iframe width dynamically
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
    <div className="bg-[#f4f3ff] min-h-screen text-gray-800">
      <Navbar2 />

      <div className="relative w-full h-screen">
        {/* Heatmap Container */}
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
          className="absolute top-0 left-0 z-0"
          style={{
            width: "100%", // Make iframe take full width
            height: "100%", // Make iframe take full height
          }}
          onLoad={() => setIframeLoaded(true)}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
};

export default HeatmapPage;
