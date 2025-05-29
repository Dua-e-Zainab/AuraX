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
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [iframeWidth, setIframeWidth] = useState("100%");

  // Time filtering states
  const [timeRange, setTimeRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [stats, setStats] = useState({
    totalInteractions: 0,
    dateRange: { from: '', to: '' }
  });

  // Mobile responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Time range options
  const timeRangeOptions = [
    { value: "all", label: "All Time" },
    { value: "1h", label: "Last Hour" },
    { value: "24h", label: "Last 24 Hours" },
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "custom", label: "Custom Range" }
  ];

  const [dataDateRange, setDataDateRange] = useState(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get date range based on selected time range
  const getDateRange = () => {
    if (!dataDateRange) {
      return {
        startDate: new Date('2020-01-01'),
        endDate: new Date('2030-12-31')
      };
    }

    const { minDate, maxDate } = dataDateRange;
    let startDate;
    let endDate = new Date(maxDate);

    switch (timeRange) {
      case "1h":
        startDate = new Date(maxDate.getTime() - 60 * 60 * 1000);
        break;
      case "24h":
        startDate = new Date(maxDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(maxDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(maxDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "custom":
        startDate = customStartDate ? new Date(customStartDate) : new Date(minDate);
        endDate = customEndDate ? new Date(customEndDate) : new Date(maxDate);
        break;
      default:
        startDate = new Date(minDate);
        endDate = new Date(maxDate);
    }

    if (startDate < minDate) {
      startDate = new Date(minDate);
    }

    return { startDate, endDate };
  };

  // Fetch the date range of available data
  useEffect(() => {
    const fetchDataDateRange = async () => {
      if (!projectId) return;

      try {
        setDataLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `https://aura-x.up.railway.app/api/track/heatmap/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.length > 0) {
            const timestamps = data.data.map(item => new Date(item.timestamp));
            const minDate = new Date(Math.min(...timestamps));
            const maxDate = new Date(Math.max(...timestamps));
            
            setDataDateRange({ minDate, maxDate });
            console.log('Data date range:', { minDate, maxDate });
          }
        }
      } catch (error) {
        console.error("Error fetching data date range:", error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchDataDateRange();
  }, [projectId]);

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

  // Fetch heatmap data with time filters
  useEffect(() => {
    const fetchHeatmapData = async () => {
      if (!projectId) return;

      try {
        setDataLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const { startDate, endDate } = getDateRange();
        
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });

        const response = await fetch(
          `https://aura-x.up.railway.app/api/track/heatmap/${projectId}?${params}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error(`Error fetching heatmap data: ${response.statusText}`);

        const data = await response.json();
        
        console.log('API Response:', data);
        console.log('Query params:', params.toString());
        console.log('Date range:', { startDate, endDate });
        
        const processedData = data.data.map((point) => ({
          x: point.x,
          y: point.y,
          value: point.intensity,
          timestamp: point.timestamp,
          page: point.page
        }));

        console.log('Processed data length:', processedData.length);

        setHeatmapData(processedData);
        setStats(data.stats || { 
          totalInteractions: processedData.length,
          dateRange: { from: startDate.toISOString(), to: endDate.toISOString() }
        });

      } catch (error) {
        console.error("Error fetching heatmap data:", error.message);
      } finally {
        setDataLoading(false);
      }
    };

    fetchHeatmapData();
  }, [projectId, timeRange, customStartDate, customEndDate]);

  // Update heatmap when data changes
  useEffect(() => {
    if (!iframeLoaded || heatmapData.length === 0) return;

    const heatmapContainer = document.getElementById("heatmap-container");
    if (!heatmapContainer) return;

    if (!heatmapInstance.current) {
      heatmapInstance.current = h337.create({
        container: heatmapContainer,
        radius: isMobile ? 20 : 30,
        maxOpacity: 0.6,
        blur: 0.8,
        gradient: { 0.2: "blue", 0.5: "yellow", 1.0: "red" },
      });
    }

    heatmapInstance.current.setData({
      max: Math.max(...heatmapData.map((point) => point.value), 10),
      data: heatmapData.map((point) => ({
        x: point.x,
        y: point.y - scrollY,
        value: point.value,
      })),
    });
  }, [iframeLoaded, heatmapData, scrollY, isMobile]);

  // Handle iframe messages
  useEffect(() => {
    const handleMessage = (event) => {
      if (!projectUrl) return;

      const expectedOrigin = new URL(projectUrl).origin;
      if (event.origin !== expectedOrigin) return;

      const { type, scrollY, contentWidth } = event.data;
      if (type === "SCROLL_EVENT") {
        setScrollY(scrollY);
      }
      if (type === "CONTENT_WIDTH") {
        setIframeWidth(`${contentWidth}px`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [projectUrl]);

  // Loading state with the specified animation
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

  return (
    <div className="bg-[#f4f3ff] min-h-screen text-gray-800">
      <div className="relative z-30">
        <Navbar2 />
      </div>

      {/* Enhanced Controls Panel with Mobile Responsiveness */}
      <div className={`bg-white shadow-md border-b relative z-20 transition-all duration-300 ease-in-out ${
        showControls ? 'max-h-96 opacity-100' : 'max-h-16 opacity-90'
      }`}>
        {/* Mobile Toggle Button */}
        {isMobile && (
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={() => setShowControls(!showControls)}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <span>Filter Controls</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${
                  showControls ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Controls Content */}
        <div className={`p-4 transition-all duration-300 ease-in-out ${
          isMobile && !showControls ? 'hidden' : 'block'
        }`}>
          {/* Data Loading Indicator */}
          {dataLoading && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-sm text-blue-700">Updating data...</span>
              </div>
            </div>
          )}

          {/* Time Range Controls - Mobile Responsive Layout */}
          <div className="flex flex-col lg:flex-row lg:flex-wrap items-start lg:items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
              >
                {timeRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Date Range - Mobile Responsive */}
            {timeRange === "custom" && (
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">From:</label>
                  <input
                    type="datetime-local"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">To:</label>
                  <input
                    type="datetime-local"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Stats Display with Animation */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 transform hover:scale-105 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-purple-600 font-medium">Total Interactions</div>
                  <div className="text-2xl font-bold text-purple-700 mt-1">
                    {stats.totalInteractions.toLocaleString()}
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 transform hover:scale-105 transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-blue-600 font-medium">Data Points</div>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {heatmapData.length.toLocaleString()}
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 transform hover:scale-105 transition-all duration-200 hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-green-600 font-medium">Time Period</div>
                  <div className="text-lg font-bold text-green-700 mt-1">
                    {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Display with Mobile Optimizations */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Loading Overlay for Data Updates */}
        {dataLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30 transition-opacity duration-300">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style={{ animationDelay: '150ms' }}></div>
              </div>
              <div className="text-sm font-medium text-gray-600">Updating heatmap...</div>
            </div>
          </div>
        )}

        {/* Heatmap Container */}
        <div
          id="heatmap-container"
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 transition-opacity duration-500"
          style={{ opacity: dataLoading ? 0.3 : 1 }}
        ></div>

        {/* Enhanced Tooltip */}
        <div
          id="heatmap-tooltip"
          className="absolute bg-gray-900 text-white text-xs rounded-lg px-3 py-2 pointer-events-none hidden z-20 shadow-lg border border-gray-700"
          style={{ display: "none" }}
        ></div>

        {/* Iframe with Smooth Transitions */}
        <iframe
          ref={iframeRef}
          src={projectUrl}
          className="absolute top-0 left-0 z-0 transition-opacity duration-300"
          style={{
            width: "100%",
            height: "100%",
            opacity: iframeLoaded ? 1 : 0.5,
          }}
          onLoad={() => setIframeLoaded(true)}
          sandbox="allow-same-origin allow-scripts"
        />

        {/* Mobile Instructions Overlay */}
        {isMobile && heatmapData.length === 0 && !dataLoading && (
          <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 p-4 rounded-lg shadow-lg z-20">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                No heatmap data available for the selected time period.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Try adjusting the time range or check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatmapPage;