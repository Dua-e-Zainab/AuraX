import React, { useState, useEffect, useRef, useCallback } from "react";
import h337 from "heatmap.js";
import Navbar2 from "./Navbar2.js";

const HeatmapPage = () => {
  const [heatmapData, setHeatmapData] = useState([]); // Heatmap points
  const [rankedClicks, setRankedClicks] = useState([]); // Ranked clicks
  const [totalClicks, setTotalClicks] = useState(0); // Total clicks
  const [iframeLoaded, setIframeLoaded] = useState(false); // Iframe loaded state
  const iframeRef = useRef(null);
  const heatmapInstance = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0); // Track the scroll position
  const [isScrolling, setIsScrolling] = useState(false); // Track if scrolling is happening

  // Fetch heatmap and ranked clicks data
  const fetchHeatmapData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/track/heatmap/7hf3b7nh8`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        const transformedData = data.data.map((point) => ({
          x: point.x,
          y: point.y,
          value: point.intensity,
        }));

        const total = transformedData.reduce((sum, point) => sum + point.value, 0);
        setTotalClicks(total);
        setHeatmapData(transformedData);
        setRankedClicks(data.rankedClicks || []);
      } else {
        console.error("Error fetching heatmap data:", data.message);
      }
    } catch (err) {
      console.error("Failed to fetch heatmap data:", err);
    }
  }, []);

  // Initialize heatmap
  const initializeHeatmap = useCallback(() => {
    const heatmapContainer = document.getElementById("heatmap-container");
    if (!heatmapContainer) return;

    heatmapInstance.current = h337.create({
      container: heatmapContainer,
      radius: 30,
      maxOpacity: 0.6,
      blur: 0.8,
      gradient: { 0.2: "blue", 0.5: "yellow", 1.0: "red" },
    });

    // Set the initial data after initialization
    heatmapInstance.current.setData({
      max: 20,
      data: heatmapData,
    });
  }, [heatmapData]);

  // Track click on the parent document (main page)
  const handlePageClick = useCallback((event) => {
    // Get the click position relative to the parent page
    const x = event.clientX;
    const y = event.clientY;

    // Adjust the Y position based on the page scroll position
    const adjustedY = y + scrollPosition;

    // Save the click positions fixed relative to the parent document (without moving with the iframe)
    const newPoint = { x, y: adjustedY, value: 1 }; // Use adjusted Y position
    setHeatmapData((prevData) => {
      const updatedData = [...prevData, newPoint];
      setTotalClicks(updatedData.reduce((sum, point) => sum + point.value, 0));
      return updatedData;
    });
  }, [scrollPosition]);

  // Handle page scroll
  const handleScroll = useCallback(() => {
    setScrollPosition(window.scrollY); // Update the scroll position
  }, []);

  // Fetch data and initialize heatmap when the component is loaded
  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData]);

  // Initialize heatmap and iframe on load
  useEffect(() => {
    if (iframeLoaded) {
      initializeHeatmap();
    }
  }, [iframeLoaded, initializeHeatmap]);

  // Add event listener for page click and scroll
  useEffect(() => {
    window.addEventListener("click", handlePageClick);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("click", handlePageClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handlePageClick, handleScroll]);

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
            <p className="text-purple-700 font-medium">Total Clicks</p>
            <p className="text-3xl font-bold text-purple-600">{totalClicks}</p>
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
            <div
              id="heatmap-container"
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
            ></div>

            {/* Iframe */}
            <iframe
              ref={iframeRef}
              src="https://nzxtsol.com/aurax/"
              title="Heatmap Content"
              className="w-full h-full absolute top-0 left-0 z-0"
              onLoad={() => setIframeLoaded(true)}
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HeatmapPage;
