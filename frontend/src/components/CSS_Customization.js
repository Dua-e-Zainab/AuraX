import React, { useState, useEffect, useRef } from "react";
import Navbar2 from "./Navbar2";
import h337 from "heatmap.js";
import { useParams } from "react-router-dom";
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }

  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }

  @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(20px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-slideInLeft {
    animation: slideInLeft 0.6s ease-out;
  }

  .animate-slideInRight {
    animation: slideInRight 0.6s ease-out;
  }

  .animate-slideInUp {
    animation: slideInUp 0.6s ease-out;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-thin {
    scrollbar-width: thin;
  }

  .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
    background-color: #4b5563;
    border-radius: 4px;
  }

  .scrollbar-track-gray-800::-webkit-scrollbar-track {
    background-color: #1f2937;
  }

  @media (max-width: 480px) {
    .xs\\:flex-row {
      flex-direction: row;
    }
    .xs\\:items-center {
      align-items: center;
    }
    .xs\\:flex-none {
      flex: none;
    }
  }
`;
const CSSCustomization = () => {
  const { projectId: paramProjectId } = useParams();
  const projectId = paramProjectId || localStorage.getItem("projectId");
  const [projectUrl, setProjectUrl] = useState("");
  const [heatmapData, setHeatmapData] = useState([]);
  const [cssSuggestions, setCssSuggestions] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [selectedZoneFilter, setSelectedZoneFilter] = useState("all");
  const [copiedSections, setCopiedSections] = useState({});
  const iframeRef = useRef(null);
  const heatmapContainerRef = useRef(null);
  const heatmapInstance = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeWidth, setIframeWidth] = useState("100%");
  const [iframeHeight, setIframeHeight] = useState("100%");
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  
  useEffect(() => {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
  
  return () => {
    document.head.removeChild(styleSheet);
  };
}, []);
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 1024); // Adjust breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch project URL
  useEffect(() => {
    const fetchProjectUrl = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`https://aura-x.up.railway.app/api/projects/${projectId}`, {
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectUrl();
  }, [projectId]);

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      if (!projectId) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `https://aura-x.up.railway.app/api/track/heatmap/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error(`Error fetching heatmap data: ${response.statusText}`);

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

  // Update heatmap when scrollY changes or data changes
  useEffect(() => {
    if (!iframeLoaded || heatmapData.length === 0 || !heatmapInstance.current || !showHeatmap) return;

    // Update heatmap with current data and scroll position
    heatmapInstance.current.setData({
      max: Math.max(...heatmapData.map((point) => point.value), 10),
      data: heatmapData.map((point) => ({
        x: point.x,
        y: point.y - scrollY, // Adjust for scroll
        value: point.value,
      })),
    });
  }, [scrollY, heatmapData, iframeLoaded, showHeatmap]);

  // Initialize heatmap and generate CSS suggestions
  useEffect(() => {
    if (!iframeLoaded || heatmapData.length === 0) return;

    const heatmapContainer = heatmapContainerRef.current;
    if (!heatmapContainer) return;

    // Initialize heatmap instance
    if (!heatmapInstance.current) {
      heatmapInstance.current = h337.create({
        container: heatmapContainer,
        radius: 30,
        maxOpacity: 0.6,
        blur: 0.8,
        gradient: { 0.2: "blue", 0.5: "yellow", 1.0: "red" },
      });
    }

    // Set initial heatmap data
    if (showHeatmap) {
      heatmapInstance.current.setData({
        max: Math.max(...heatmapData.map((point) => point.value), 10),
        data: heatmapData.map((point) => ({
          x: point.x,
          y: point.y - scrollY,
          value: point.value,
        })),
      });
    }

    // Define CSS suggestions for different zones - without detailed content for hot zones
    const hotZoneSuggestions = [
      { id: "hot-zone-1", zone: "Hot Zone" },
      { id: "hot-zone-2", zone: "Hot Zone" },
      { id: "hot-zone-3", zone: "Hot Zone" }
    ];

    const coldZoneSuggestions = [
      {
        suggestion: "Make inactive sections more noticeable",
        cssCode: `.inactive-section {
  background-color: #f5f9ff;
  border: 2px dashed #c8d6e5;
  border-radius: 8px;
  padding: 20px;
  opacity: 0.9;
  transform: scale(1.02);
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(200, 214, 229, 0.3);
}

.inactive-section:hover {
  opacity: 1;
  transform: scale(1.03);
  border-style: solid;
  box-shadow: 0 8px 20px rgba(200, 214, 229, 0.5);
}`
      },
      {
        suggestion: "Improve content readability in less viewed areas",
        cssCode: `.cold-zone-content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #2c3e50;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-left: 4px solid #3498db;
  margin: 1.5rem 0;
  border-radius: 0 6px 6px 0;
}`
      }
    ];

    const neutralZoneSuggestions = [
      {
        suggestion: "Improve paragraph styling and readability",
        cssCode: `p {
  font-size: 1rem;
  color: #333;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  max-width: 70ch; /* Optimal reading width */
}`
      },
      {
        suggestion: "Enhance link styles for better engagement",
        cssCode: `a {
  color: #3498db;
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

a:hover {
  color: #2980b9;
}`
      }
    ];

    // Process data for heatmap and suggestions
    const coordinateCounts = {};
    heatmapData.forEach((point) => {
      const key = `${point.x},${point.y}`;
      coordinateCounts[key] = (coordinateCounts[key] || 0) + 1;
    });

    const countArray = Object.keys(coordinateCounts).map((key) => ({
      key,
      count: coordinateCounts[key],
      x: parseFloat(key.split(",")[0]),
      y: parseFloat(key.split(",")[1]),
    }));

    countArray.sort((a, b) => b.count - a.count);

    const totalPoints = countArray.length;
    const hotThresholdIndex = Math.floor(totalPoints * 0.3);
    const coldThresholdIndex = Math.floor(totalPoints * 0.7);

    const suggestions = countArray.map((point, index) => {
      let zone = "Neutral Zone";
      let cssOptions = neutralZoneSuggestions;

      if (index < hotThresholdIndex) {
        zone = "Hot Zone";
        cssOptions = hotZoneSuggestions;
      } else if (index >= coldThresholdIndex) {
        zone = "Cold Zone";
        cssOptions = coldZoneSuggestions;
      }

      // For hot zones, just indicate the zone without detailed suggestions
      if (zone === "Hot Zone") {
        return {
          id: `zone-${index}`,
          zone,
          x: point.x,
          y: point.y,
          count: point.count,
        };
      }

      // For other zones, select a suggestion
      const randomSuggestionIndex = Math.floor(Math.random() * cssOptions.length);
      return {
        id: `zone-${index}`,
        zone,
        ...cssOptions[randomSuggestionIndex],
        x: point.x,
        y: point.y,
        count: point.count,
      };
    });

    setCssSuggestions(suggestions);
  }, [iframeLoaded, heatmapData]);

  // Listen for iframe messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (!projectUrl) return;

      try {
        const expectedOrigin = new URL(projectUrl).origin;
        if (event.origin !== expectedOrigin) return;

        const { type, scrollY: newScrollY, contentWidth, contentHeight } = event.data;

        if (type === "SCROLL_EVENT") {
          setScrollY(newScrollY);
        }

        if (type === "CONTENT_WIDTH") {
          setIframeWidth(`${contentWidth}px`);
        }

        if (type === "CONTENT_HEIGHT") {
          setIframeHeight(`${contentHeight}px`);
        }
      } catch (error) {
        console.error("Error processing message:", error);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [projectUrl]);

  // Handle resize of the window
  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current) {
        // Update the heatmap container size to match the iframe size
        if (heatmapContainerRef.current) {
          heatmapContainerRef.current.style.width = `${iframeRef.current.clientWidth}px`;
          heatmapContainerRef.current.style.height = `${iframeRef.current.clientHeight}px`;
        }

        // If the heatmap instance exists, redraw it
        if (heatmapInstance.current) {
          heatmapInstance.current.repaint();
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Copy to clipboard implementation
  const handleCopyClick = (e, code, id) => {
    e.preventDefault();

    // Copy the code using a different approach
    const textArea = document.createElement('textarea');
    textArea.value = code;
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    textArea.style.left = '-9999px';    // Move element out of view
    textArea.style.top = '0';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        // Update copied state
        setCopiedSections({...copiedSections, [id]: "Copied!"});

        // Reset after delay
        setTimeout(() => {
          setCopiedSections(prev => {
            const updated = {...prev};
            delete updated[id];
            return updated;
          });
        }, 2000);
      } else {
        console.error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Could not copy text: ', err);
    }

    document.body.removeChild(textArea);
  };

  // Filter suggestions based on selected zone
  const filteredSuggestions = selectedZoneFilter === "all"
    ? cssSuggestions
    : cssSuggestions.filter(suggestion => suggestion.zone === selectedZoneFilter);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 absolute top-2 left-2 animate-pulse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading your project...</p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }


  // Determine zone-specific colors
  const getZoneColors = (zone) => {
    switch (zone) {
      case "Hot Zone":
        return {
          bg: "bg-red-100",
          border: "border-red-400",
          text: "text-red-700",
          button: "bg-red-600 hover:bg-red-700",
          badge: "bg-red-500"
        };
      case "Cold Zone":
        return {
          bg: "bg-blue-100",
          border: "border-blue-400",
          text: "text-blue-700",
          button: "bg-blue-600 hover:bg-blue-700",
          badge: "bg-blue-500"
        };
      default:
        return {
          bg: "bg-purple-100",
          border: "border-purple-400",
          text: "text-purple-700",
          button: "bg-purple-600 hover:bg-purple-700",
          badge: "bg-purple-500"
        };
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen text-gray-800 flex flex-col">
      {/* Navbar with higher z-index to stay on top */}
      <div className="relative z-50">
        <Navbar2 />
      </div>

      {/* Control Panel */}
      <div className="bg-white shadow-md p-3 sm:p-4 mb-4 transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text leading-tight animate-fadeIn">
              CSS Optimizer
            </h1>
            <div className="flex items-center gap-2 animate-slideInLeft">
              <span className="text-xs sm:text-sm text-gray-600">Heatmap:</span>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  showHeatmap 
                    ? 'bg-purple-100 text-purple-700 shadow-md' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {showHeatmap ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div className="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 animate-slideInRight">
              <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">Filter:</span>
              <select
                value={selectedZoneFilter}
                onChange={(e) => setSelectedZoneFilter(e.target.value)}
                className="bg-white border border-gray-300 text-gray-700 py-1.5 px-2 sm:px-3 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 hover:border-purple-300 min-w-0 flex-1 xs:flex-none"
              >
                <option value="all">All Zones</option>
                <option value="Hot Zone">Hot Zones</option>
                <option value="Neutral Zone">Neutral Zones</option>
                <option value="Cold Zone">Cold Zones</option>
              </select>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-wrap animate-fadeIn">
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-xs sm:text-sm text-gray-600">Hot</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '0.2s'}}></span>
                <span className="text-xs sm:text-sm text-gray-600">Neutral</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="inline-flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: '0.4s'}}></span>
                <span className="text-xs sm:text-sm text-gray-600">Cold</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Iframe and Heatmap Container */}
        <div className="relative flex-grow overflow-hidden transition-all duration-500" style={{ 
          height: isMobileView ? '45vh' : '60vh',
          minHeight: '300px'
        }}>
          {/* Iframe-sized container for heatmap */}
          <div
            ref={heatmapContainerRef}
            id="heatmap-container"
            className={`absolute top-0 left-0 w-full h-full pointer-events-none z-10 ${showHeatmap ? 'opacity-70' : 'opacity-0'}`}
            style={{
              width: iframeWidth,
              height: iframeHeight,
              transition: 'opacity 0.3s ease'
            }}
          ></div>

          <div
            id="heatmap-tooltip"
            className="absolute bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none hidden z-20 animate-fadeIn"
            style={{ display: "none" }}
          ></div>

          <iframe
            ref={iframeRef}
            src={projectUrl}
            className="absolute top-0 left-0 z-0 w-full h-full"
            onLoad={() => {
              setIframeLoaded(true);

              // Add script to the iframe to track dimensions and scrolling
              const iframe = iframeRef.current;
              if (iframe && iframe.contentWindow) {
                const script = document.createElement('script');
                script.textContent = `
                  // Send initial dimensions
                  window.parent.postMessage({
                    type: 'CONTENT_WIDTH',
                    contentWidth: document.documentElement.scrollWidth || document.body.scrollWidth
                  }, '*');

                  window.parent.postMessage({
                    type: 'CONTENT_HEIGHT',
                    contentHeight: document.documentElement.scrollHeight || document.body.scrollHeight
                  }, '*');

                  // Track scroll position
                  window.addEventListener('scroll', function() {
                    window.parent.postMessage({
                      type: 'SCROLL_EVENT',
                      scrollY: window.scrollY || document.documentElement.scrollTop
                    }, '*');
                  });

                  // Track resize
                  window.addEventListener('resize', function() {
                    window.parent.postMessage({
                      type: 'CONTENT_WIDTH',
                      contentWidth: document.documentElement.scrollWidth || document.body.scrollWidth
                    }, '*');

                    window.parent.postMessage({
                      type: 'CONTENT_HEIGHT',
                      contentHeight: document.documentElement.scrollHeight || document.body.scrollHeight
                    }, '*');
                  });
                `;

                try {
                  iframe.contentDocument.head.appendChild(script);
                } catch (error) {
                  console.error("Cannot access iframe content document:", error);
                }
              }
            }}
            sandbox="allow-same-origin allow-scripts"
          />

          {/* Zone Markers - only show if heatmap is displayed */}
         {showHeatmap && filteredSuggestions.map((suggestion, index) => {
          const zoneColors = getZoneColors(suggestion.zone);

          return (
            <div
              key={suggestion.id}
              className="absolute z-20 transition-all duration-500 ease-out animate-fadeIn"
              style={{
                top: `${suggestion.y - scrollY}px`,
                left: `${suggestion.x}px`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div
                className={`${zoneColors.badge} text-white text-xs px-2 py-1 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform duration-200 cursor-pointer`}
              >
                {suggestion.zone.replace(' Zone', '')}
              </div>
            </div>
          );
        })}

        </div>

        {/* Suggestions Section with Tabs */}
        <div className="bg-white shadow-lg overflow-hidden flex-grow transition-all duration-300">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setSelectedZoneFilter("all")}
            className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 hover:bg-gray-50 ${
              selectedZoneFilter === "all"
                ? "border-b-2 border-purple-500 text-purple-600 bg-purple-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="mr-1 sm:mr-2">All Zones</span>
            <span className="bg-gray-200 text-gray-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full transition-colors duration-200">
              {cssSuggestions.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedZoneFilter("Hot Zone")}
            className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 hover:bg-red-50 ${
              selectedZoneFilter === "Hot Zone"
                ? "border-b-2 border-red-500 text-red-600 bg-red-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="mr-1 sm:mr-2">Hot Zones</span>
            <span className="bg-red-100 text-red-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full transition-colors duration-200">
              {cssSuggestions.filter(s => s.zone === "Hot Zone").length}
            </span>
          </button>

          <button
            onClick={() => setSelectedZoneFilter("Neutral Zone")}
            className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 hover:bg-purple-50 ${
              selectedZoneFilter === "Neutral Zone"
                ? "border-b-2 border-purple-500 text-purple-600 bg-purple-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="mr-1 sm:mr-2">Neutral Zones</span>
            <span className="bg-purple-100 text-purple-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full transition-colors duration-200">
              {cssSuggestions.filter(s => s.zone === "Neutral Zone").length}
            </span>
          </button>

          <button
            onClick={() => setSelectedZoneFilter("Cold Zone")}
            className={`flex items-center px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 hover:bg-blue-50 ${
              selectedZoneFilter === "Cold Zone"
                ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="mr-1 sm:mr-2">Cold Zones</span>
            <span className="bg-blue-100 text-blue-700 text-xs px-1.5 sm:px-2 py-0.5 rounded-full transition-colors duration-200">
              {cssSuggestions.filter(s => s.zone === "Cold Zone").length}
            </span>
          </button>
        </div>

          {/* Suggestion Cards */}
          <div className="p-3 sm:p-4 lg:p-6 overflow-y-auto transition-all duration-300" style={{ 
            maxHeight: isMobileView ? '45vh' : '35vh',
            minHeight: '200px'
          }}>
            {/* No suggestions message */}
            {filteredSuggestions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center animate-fadeIn">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3 sm:mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg font-medium">No zones available for this filter</p>
                <p className="text-gray-400 mt-1 sm:mt-2 text-xs sm:text-sm lg:text-base px-4">Try selecting a different zone type or check back after collecting more user data.</p>
              </div>
            )}

            {/* Hot Zones Section */}
            {selectedZoneFilter === "Hot Zone" && filteredSuggestions.length > 0 && (
              <div className="mb-4 sm:mb-6 animate-slideInUp">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                  <h2 className="text-sm sm:text-base lg:text-lg font-medium text-gray-800">Hot Zones Detected</h2>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 transform hover:scale-[1.02] transition-transform duration-200">
                  <p className="text-gray-700 text-xs sm:text-sm lg:text-base">
                    {filteredSuggestions.length} hot {filteredSuggestions.length === 1 ? 'zone has' : 'zones have'} been detected on your page.
                    These are areas where users interact the most.
                  </p>
                </div>
              </div>
            )}

            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredSuggestions
                .filter(suggestion => suggestion.zone !== "Hot Zone" && suggestion.cssCode)
                .map((suggestion, index) => {
                  const zoneColors = getZoneColors(suggestion.zone);

                  return (
                    <div
                      key={suggestion.id}
                      className={`${zoneColors.bg} border ${zoneColors.border} rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] animate-slideInUp`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {/* Card Header */}
                      <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-opacity-50 flex justify-between items-start sm:items-center">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className={`inline-block ${zoneColors.badge} text-white text-xs px-2 py-0.5 rounded-full flex-shrink-0 animate-pulse`}>
                              {suggestion.zone.replace(' Zone', '')}
                            </span>
                            <h3 className={`${zoneColors.text} font-medium text-xs sm:text-sm lg:text-base break-words`}>
                              {suggestion.suggestion}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Code Section */}
                      <div className="relative group">
                        <pre className="text-xs bg-gray-900 text-gray-100 p-3 sm:p-4 overflow-x-auto max-h-32 sm:max-h-40 lg:max-h-60 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                          <code className="font-mono">{suggestion.cssCode}</code>
                        </pre>
                        <button
                          className={`absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-1 ${zoneColors.button} text-white text-xs rounded shadow-md transition-all duration-200 opacity-70 hover:opacity-100 transform hover:scale-105 active:scale-95`}
                          onClick={(e) => handleCopyClick(e, suggestion.cssCode, suggestion.id)}
                        >
                          {copiedSections[suggestion.id] || "Copy"}
                        </button>
                      </div>

                      {/* Tips Section */}
                      <div className="px-3 py-2 sm:px-4 sm:py-3 bg-white bg-opacity-50 transition-colors duration-200 hover:bg-opacity-70">
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {suggestion.zone === "Neutral Zone" && "Use this style to maintain consistent user experience"}
                          {suggestion.zone === "Cold Zone" && "This style can help draw more attention to overlooked areas"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSSCustomization;