import React, { useState, useEffect, useRef } from "react";
import Navbar2 from "./Navbar2";
import h337 from "heatmap.js";

const CSSCustomization = () => {
  const [projectUrl, setProjectUrl] = useState("");
  const [heatmapData, setHeatmapData] = useState([]);
  const [cssSuggestions, setCssSuggestions] = useState([]);
  const [iframeScrollY, setIframeScrollY] = useState(0);
  const [hoverSuggestion, setHoverSuggestion] = useState(null);
  const [copiedSections, setCopiedSections] = useState({});
  const iframeRef = useRef(null);
  const heatmapInstance = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Fetch heatmap data dynamically
  useEffect(() => {
    const fetchHeatmapData = async () => {
      const token = localStorage.getItem("token");
      const projectId = localStorage.getItem("projectId");

      try {
        const response = await fetch(
          `http://localhost:5000/api/track/heatmap/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch heatmap data");

        const data = await response.json();

        const transformedData = data.data.map((point) => ({
          x: point.x,
          y: point.y,
          value: point.intensity,
        }));

        setHeatmapData(transformedData);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    if (projectUrl) fetchHeatmapData();
  }, [projectUrl]);

  // Initialize Heatmap
  useEffect(() => {
    if (!iframeLoaded || !projectUrl) return;

    const heatmapContainer = document.getElementById("heatmap-container");
    if (!heatmapContainer) return;

    if (!heatmapInstance.current) {
      heatmapInstance.current = h337.create({
        container: heatmapContainer,
        radius: 25,
        maxOpacity: 0.6,
        blur: 0.8,
        gradient: { 0.2: "blue", 0.5: "yellow", 1.0: "red" },
      });
    }

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
      let suggestion = "This area could use more engagement.";
      const neutralCSSOptions = [
        `p {
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}`,
        `a {
  color: #007bff;
  text-decoration: underline;
}`,
        `ul {
  list-style-type: square;
  margin-left: 20px;
}`,
      ];
      let cssCode = neutralCSSOptions[Math.floor(Math.random() * neutralCSSOptions.length)];

      if (index < hotThresholdIndex) {
        zone = "Hot Zone";
        suggestion = "This area is highly active; optimize its content.";
        cssCode = `button { 
  background-color: #ff5722; 
  color: white; 
  border-radius: 8px; 
  padding: 10px 20px; 
}`;
      } else if (index >= coldThresholdIndex) {
        zone = "Cold Zone";
        suggestion = "This area is less active; consider making it more prominent.";
        const coldCSSOptions = [
          `div.inactive-section {
  background-color: #f0f8ff;
  border: 2px dashed #ccc;
  padding: 20px;
  opacity: 0.8;
}`,
          `h1 {
  text-align: center;
  color: #666;
}`,
          `img {
  opacity: 0.5;
  border-radius: 8px;
}`,
        ];
        cssCode = coldCSSOptions[Math.floor(Math.random() * coldCSSOptions.length)];
      }

      return {
        zone,
        suggestion,
        cssCode,
        x: point.x,
        y: point.y,
        count: point.count,
      };
    });

    setCssSuggestions(suggestions);

    const adjustedData = countArray.map((point) => ({
      x: point.x,
      y: point.y - iframeScrollY,
      value: point.count,
    }));

    const maxIntensity = Math.max(...countArray.map((point) => point.count), 10);
    heatmapInstance.current.setData({
      max: maxIntensity,
      data: adjustedData,
    });
  }, [heatmapData, iframeScrollY, iframeLoaded, projectUrl]);

  // Track iframe scroll
  useEffect(() => {
    const handleScrollMessage = (event) => {
      const { type, scrollY } = event.data;
      if (type === "SCROLL_EVENT") setIframeScrollY(scrollY);
    };

    window.addEventListener("message", handleScrollMessage);

    return () => window.removeEventListener("message", handleScrollMessage);
  }, []);

  // Copy to clipboard with section-specific feedback
  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedSections((prev) => ({ ...prev, [index]: "Copied" }));
      setTimeout(() => {
        setCopiedSections((prev) => {
          const updated = { ...prev };
          delete updated[index];
          return updated;
        });
      }, 2000);
    });
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 to-purple-200 min-h-screen text-gray-800">
      <Navbar2 />

      <div className="py-12 px-8 md:px-20">
        <h1 className="text-4xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            AuraX | CSS Customization
          </span>
        </h1>

        {/* Project URL Input */}
        <div className="mb-8 bg-white rounded-lg shadow-lg p-6">
          <label
            htmlFor="project-url"
            className="block text-lg font-medium text-purple-600"
          >
            Project URL
          </label>
          <input
            id="project-url"
            type="text"
            value={projectUrl}
            onChange={(e) => setProjectUrl(e.target.value)}
            placeholder="Enter your project URL"
            className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Heatmap Container */}
        {projectUrl && (
          <div>
            <div className="relative bg-white rounded-lg shadow-lg p-6">
              <div
                id="heatmap-container"
                className="absolute inset-0 pointer-events-none z-10"
              ></div>

              {/* CSS Suggestions on Heatmap Points */}
              {cssSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="absolute z-20 bg-white text-gray-800 text-xs p-2 rounded shadow-md border border-gray-300"
                  style={{
                    top: `${parseFloat(suggestion.y) - iframeScrollY}px`,
                    left: `${suggestion.x}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoverSuggestion(suggestion)} // Show suggestion on hover
                  onMouseLeave={() => setHoverSuggestion(null)} // Remove suggestion when not hovering
                >
                  <p className="font-semibold text-purple-600">{suggestion.zone}</p>
                </div>
              ))}

              {/* Tooltip */}
              {hoverSuggestion && (
                <div
                  className="absolute z-30 bg-purple-50 text-purple-800 text-sm p-3 rounded shadow-lg"
                  style={{
                    top: `${parseFloat(hoverSuggestion.y) - iframeScrollY - 50}px`,
                    left: `${hoverSuggestion.x}px`,
                    transform: "translate(-50%, -150%)",
                  }}
                >
                  <p className="font-semibold">{hoverSuggestion.zone}</p>
                  <p>{hoverSuggestion.suggestion}</p>
                </div>
              )}

              {/* Iframe */}
              <iframe
                ref={iframeRef}
                src={projectUrl}
                className="w-full h-[600px] border rounded-lg shadow-lg"
                sandbox="allow-scripts allow-same-origin"
                onLoad={() => setIframeLoaded(true)}
              />
            </div>

            {/* CSS Code Suggestions Section */}
            <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-medium text-purple-600">
                CSS Code Suggestions for Cold and Neutral Zones
              </h2>
              {cssSuggestions
                .filter((s) => s.zone === "Cold Zone" || s.zone === "Neutral Zone")
                .map((suggestion, index) => (
                  <div key={index} className="mt-4 bg-gray-100 rounded-lg p-4">
                    <p className="text-gray-800 font-semibold">
                      {suggestion.zone}: {suggestion.suggestion}
                    </p>
                    <pre className="text-sm bg-gray-50 p-3 rounded-lg text-gray-800">
                      <code>{suggestion.cssCode}</code>
                    </pre>
                    <button
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg"
                      onClick={() => copyToClipboard(suggestion.cssCode, index)}
                    >
                      Copy to clipboard
                    </button>
                    {copiedSections[index] && (
                      <p className="mt-2 text-green-600 font-medium">
                        {copiedSections[index]}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSSCustomization;
