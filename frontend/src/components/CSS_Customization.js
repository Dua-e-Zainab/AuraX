import React, { useState, useEffect, useRef } from "react";
import Navbar2 from "./Navbar2";
import h337 from "heatmap.js";
import { useParams } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const [iframeWidth, setIframeWidth] = useState("100%");
  const [iframeHeight, setIframeHeight] = useState("100%");
  const [showHeatmap, setShowHeatmap] = useState(true);

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
      } finally {
        setLoading(false);
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
          `http://localhost:5000/api/track/heatmap/${projectId}`,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="border-t-4 border-b-4 border-purple-500 w-16 h-16 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your project...</p>
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
      <div className="bg-white shadow-md p-4 mb-4 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">CSS Optimizer</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Heatmap:</span>
            <button 
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1 text-sm rounded-full font-medium ${showHeatmap ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}
            >
              {showHeatmap ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter:</span>
            <select 
              value={selectedZoneFilter}
              onChange={(e) => setSelectedZoneFilter(e.target.value)}
              className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Zones</option>
              <option value="Hot Zone">Hot Zones</option>
              <option value="Neutral Zone">Neutral Zones</option>
              <option value="Cold Zone">Cold Zones</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-600">Hot</span>
            
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-500 ml-2"></span>
            <span className="text-sm text-gray-600">Neutral</span>
            
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 ml-2"></span>
            <span className="text-sm text-gray-600">Cold</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow">
        {/* Iframe and Heatmap Container */}
        <div className="relative flex-grow overflow-hidden">
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
            className="absolute top-0 left-0 z-0"
            style={{
              width: "100%",
              height: "100%",
            }}
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
          {showHeatmap && filteredSuggestions.map((suggestion) => {
            const zoneColors = getZoneColors(suggestion.zone);
            
            return (
              <div
                key={suggestion.id}
                className="absolute z-20 transition-all duration-300"
                style={{
                  top: `${suggestion.y - scrollY}px`,
                  left: `${suggestion.x}px`,
                }}
              >
                <div
                  className={`${zoneColors.badge} text-white text-xs px-2 py-1 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2`}
                >
                  {suggestion.zone.replace(' Zone', '')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggestions Section with Tabs */}
        <div className="bg-white shadow-md overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setSelectedZoneFilter("all")}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                selectedZoneFilter === "all" 
                  ? "border-b-2 border-purple-500 text-purple-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">All Zones</span>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {cssSuggestions.length}
              </span>
            </button>
            
            <button 
              onClick={() => setSelectedZoneFilter("Hot Zone")}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                selectedZoneFilter === "Hot Zone" 
                  ? "border-b-2 border-red-500 text-red-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">Hot Zones</span>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                {cssSuggestions.filter(s => s.zone === "Hot Zone").length}
              </span>
            </button>
            
            <button 
              onClick={() => setSelectedZoneFilter("Neutral Zone")}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                selectedZoneFilter === "Neutral Zone" 
                  ? "border-b-2 border-purple-500 text-purple-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">Neutral Zones</span>
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">
                {cssSuggestions.filter(s => s.zone === "Neutral Zone").length}
              </span>
            </button>
            
            <button 
              onClick={() => setSelectedZoneFilter("Cold Zone")}
              className={`flex items-center px-6 py-3 text-sm font-medium ${
                selectedZoneFilter === "Cold Zone" 
                  ? "border-b-2 border-blue-500 text-blue-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="mr-2">Cold Zones</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                {cssSuggestions.filter(s => s.zone === "Cold Zone").length}
              </span>
            </button>
          </div>
          
          {/* Suggestion Cards */}
          <div className="p-6 overflow-y-auto max-h-96">
            {/* No suggestions message if none available */}
            {filteredSuggestions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <p className="text-gray-500 text-lg font-medium">No zones available for this filter</p>
                <p className="text-gray-400 mt-2">Try selecting a different zone type or check back after collecting more user data.</p>
              </div>
            )}
            
            {/* Hot Zones Section - Just indicator without suggestions */}
            {selectedZoneFilter === "Hot Zone" && filteredSuggestions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                  <h2 className="text-lg font-medium text-gray-800">Hot Zones Detected</h2>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    {filteredSuggestions.length} hot {filteredSuggestions.length === 1 ? 'zone has' : 'zones have'} been detected on your page. 
                    These are areas where users interact the most.
                  </p>
                </div>
              </div>
            )}
            
            {/* Suggestions Grid - Only for Cold and Neutral zones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredSuggestions
                .filter(suggestion => suggestion.zone !== "Hot Zone" && suggestion.cssCode)
                .map((suggestion) => {
                  const zoneColors = getZoneColors(suggestion.zone);
                  
                  return (
                    <div 
                      key={suggestion.id}
                      className={`${zoneColors.bg} border ${zoneColors.border} rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300`}
                    >
                      {/* Card Header */}
                      <div className="px-4 py-3 border-b border-opacity-50 flex justify-between items-center">
                        <div>
                          <span className={`inline-block ${zoneColors.badge} text-white text-xs px-2 py-0.5 rounded-full mr-2`}>
                            {suggestion.zone.replace(' Zone', '')}
                          </span>
                          <h3 className={`${zoneColors.text} font-medium inline`}>
                            {suggestion.suggestion}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Code Section */}
                      <div className="relative">
                        <pre className="text-xs bg-gray-900 text-gray-100 p-4 overflow-x-auto max-h-60 scrollbar-thin">
                          <code>{suggestion.cssCode}</code>
                        </pre>
                        <button
                          className={`absolute top-3 right-3 px-2 py-1 ${zoneColors.button} text-white text-xs rounded shadow transition-colors opacity-70 hover:opacity-100`}
                          onClick={(e) => handleCopyClick(e, suggestion.cssCode, suggestion.id)}
                        >
                          {copiedSections[suggestion.id] || "Copy"}
                        </button>
                      </div>
                      
                      {/* Tips or Explanation (optional) */}
                      <div className="px-4 py-3 bg-white bg-opacity-50">
                        <p className="text-xs text-gray-600">
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