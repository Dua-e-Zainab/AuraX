import React, { useState, useEffect } from "react";
import Navbar2 from "./Navbar2.js";
import { useNavigate } from "react-router-dom";
import { Lightbulb, TrendingUp, Clock, Eye } from "lucide-react";

const Dashboard = (props) => {
  const [metricsState, setMetrics] = useState([]); 
  const [insights, setInsights] = useState([]);
  const [distributions, setDistributions] = useState({});
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Browsers");
  const [activeTab, setActiveTab] = useState("Browsers");
  const [browsers, setBrowsers] = useState([ 
    { name: "Chrome", value: 120, color: "#3b82f6" },
    { name: "Edge", value: 40, color: "#f43f5e" },
    { name: "Firefox", value: 20, color: "#f87171" },
  ]);
  const navigate = useNavigate();

  // Consistent color mapping for all distribution types
  const categoryColors = {
    // Browsers
    Chrome: "#3b82f6",
    Edge: "#f43f5e",
    Safari: "#34d399",
    "Chrome Mobile": "#ef4444",
    "Mobile Safari": "#9333ea",
    Firefox: "#f97316",
    Opera: "#14b8a6",
    // OS
    Windows: "#3b82f6",
    macOS: "#f43f5e",
    iOS: "#34d399",
    Android: "#ef4444",
    Linux: "#9333ea",
    // Devices
    Desktop: "#3b82f6",
    Mobile: "#f43f5e",
    Tablet: "#34d399",
    // Countries
    USA: "#3b82f6",
    UK: "#f43f5e",
    Canada: "#34d399",
    Germany: "#ef4444",
    France: "#9333ea",
    // Default for others
    Others: "#6b7280",
  };
  
  // Get color based on category name with consistent fallback
  const getCategoryColor = (name, index) => {
    return categoryColors[name] || categoryColors.Others;
  };
  
  // Persist selected tab in localStorage
  useEffect(() => {
    const storedTab = localStorage.getItem('selectedTab') || 'Browsers';
    setSelectedTab(storedTab);
    setActiveTab(storedTab);
  }, []);
  
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setActiveTab(tab);
    localStorage.setItem('selectedTab', tab);
  };
  
  useEffect(() => {
    const storedProjectId = localStorage.getItem("projectId");
    if (props.projectId) {
      localStorage.setItem("projectId", props.projectId);
      setProjectId(props.projectId);  
    } else if (storedProjectId) {
      setProjectId(storedProjectId); 
    } else {
      navigate("/projects"); 
    }
  }, [props.projectId, navigate]);

  useEffect(() => {
    if (!projectId) return;
    
    const fetchDashboardData = async () => {
      setLoading(true); 

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/track/dashboard/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching dashboard data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        setMetrics(data.metrics || []); 
        setInsights(data.insights || []);
        setDistributions(data.distributions || {});

        // Process browser data with consistent coloring
        const enrichedBrowserData = (data.distributions?.browsers || [])
          .map((b, index) => ({
            name: b.browser || "Others",
            value: b.count,
            color: getCategoryColor(b.browser, index)
          }));

        setBrowsers(enrichedBrowserData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-b-4 border-purple-500 w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!projectId) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>No project selected. Please select a project from the My Projects page.</p>
      </div>
    );
  }

  const totalSessions = metricsState.find(metric => metric.title === "Sessions")?.value || 0;
  const totalClicks = metricsState.find(metric => metric.title === "Total Clicks")?.value || 0;
  const clicksPerSession = totalSessions > 0 ? (totalClicks / totalSessions) : 0;
  
  return (
    <div className="bg-[#f4f3ff] min-h-screen text-gray-800">
      {/* Navbar */}
      <header>
        <Navbar2 />
      </header>

      <main className="py-12 px-8 md:px-20">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            AuraX | Dashboard
          </span>
        </h1>
        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metricsState.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
              <p className="text-3xl font-bold text-[#6e57e0]">{metric.value}</p>
              <span className="text-gray-400 text-sm">{metric.note}</span>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#6e57e0]">Insights</h2>

          <div className="space-y-6">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center bg-gray-100 p-5 rounded-lg shadow-md">
                <div className="p-3 bg-[#6e57e0] text-white rounded-full">
                  {index === 0 && <Lightbulb size={24} />}
                  {index === 1 && <TrendingUp size={24} />}
                  {index === 2 && <Clock size={24} />}
                  {index === 3 && <Eye size={24} />}
                </div>

                <div className="ml-4">
                  <span className="text-gray-600 text-sm font-medium">{insight.label}</span>
                  <span className="block text-[#6e57e0] text-3xl font-bold mt-1">{insight.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Smart Events and Project Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Smart Events</h2>
            {["Downloads", "Sign up", "Contact us", "Login"].map((event, index) => (
              <div key={index} className="flex justify-between text-gray-600 mb-2">
                <span>{event}</span>
                <span className="font-bold">8 sessions</span>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Project</h2>
            <div className="text-center">
              <div className="relative mx-auto w-32 h-32 border-8 border-[#6e57e0] rounded-full">
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                  {clicksPerSession.toFixed(2)}
                </div>
              </div>
              <p className="mt-4 text-gray-400">Heatmaps</p>
            </div>
          </div>
        </div>

        {/* Distribution Section (Browsers, Countries, etc.) */}
        <div className="bg-white p-8 rounded-lg shadow-md mt-8">
          {/* Tabs Navbar */}
          <nav className="flex border-b mb-6">
          {["Browsers", "Countries", "Devices", "Operating Systems"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}           
              className={`px-4 py-2 font-semibold transition-colors duration-300 focus:outline-none ${
                activeTab === tab
                  ? "text-[#6e57e0] border-b-2 border-[#6e57e0]"
                  : "text-gray-400 hover:text-[#6e57e0]"
              }`}
            >
              {tab}
            </button>
          ))}
          </nav>

          {/* Distribution Content */}
          <h2 className="text-2xl font-semibold mb-4 text-[#6e57e0]">{selectedTab}</h2>
          <div className="flex flex-col items-center">
            {/* Donut Chart - Fixed to show properly with correct stroke-dashoffset */}
            <div className="relative w-80 h-80 mb-8 lg:mb-0 lg:mr-8 flex justify-center items-center">
              <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                {(() => {
                  // Get the appropriate data based on selected tab
                  const key = selectedTab === "Operating Systems" ? "os" : selectedTab.toLowerCase();
                  const data = (distributions[key] || []).filter(item => item.count > 0);
                  
                  // Calculate total for percentages
                  const total = data.reduce((acc, item) => acc + item.count, 0);
                  
                  // If no data, return an empty circle
                  if (total === 0) {
                    return (
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                        fill="none"
                      />
                    );
                  }

                  // Track cumulative stroke offset
                  let cumulativeOffset = 0;
                  
                  return data.map((item, index) => {
                    // Determine item name based on the selected tab
                    let itemName;
                    if (selectedTab === "Browsers") {
                      itemName = item.browser || "Others";
                    } else if (selectedTab === "Countries") {
                      itemName = item.country || "Others";
                    } else if (selectedTab === "Devices") {
                      itemName = item.device || "Others";
                    } else if (selectedTab === "Operating Systems") {
                      itemName = item.os || "Others";
                    } else {
                      itemName = "Others";
                    }
                    
                    // Calculate percentage and arc length
                    const percentage = (item.count / total) * 100;
                    
                    // The circumference of the circle is 2πr
                    // For an SVG circle with r="15.9155", the circumference is approximately 100
                    const circumference = 2 * Math.PI * 15.9155;
                    
                    // Calculate dash length based on percentage of circumference
                    const dashLength = (percentage / 100) * circumference;
                    const dashArray = `${dashLength} ${circumference - dashLength}`;
                    
                    // Get a consistent color for this category
                    const color = getCategoryColor(itemName, index);
                    
                    // Store current offset for this slice
                    const currentOffset = cumulativeOffset;
                    
                    // Update cumulative offset for next slice (negative because we're going clockwise)
                    cumulativeOffset += dashLength;
                    
                    return (
                      <circle
                        key={index}
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray={dashArray}
                        strokeDashoffset={-currentOffset}
                        fill="none"
                      />
                    );
                  });
                })()}
              </svg>
            </div>
          </div>

          {/* Stats Display Below Donut Chart */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Overall Stats</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(() => {
              // Get correct key for the selected tab
              const key = selectedTab === "Operating Systems" ? "os" : selectedTab.toLowerCase();
              const data = (distributions[key] || []).filter(item => item.count > 0);
              const total = data.reduce((acc, item) => acc + item.count, 0);
              
              if (data.length === 0) {
                return (
                  <li className="text-gray-500 p-3">No data available for {selectedTab}</li>
                );
              }
              
              return data.map((item, index) => {
                // Determine the correct property name based on the tab
                let itemName;
                if (selectedTab === "Browsers") {
                  itemName = item.browser || "Others";
                } else if (selectedTab === "Countries") {
                  itemName = item.country || "Others";
                } else if (selectedTab === "Devices") {
                  itemName = item.device || "Others";
                } else if (selectedTab === "Operating Systems") {
                  itemName = item.os || "Others";
                } else {
                  itemName = "Others";
                }
                
                const percentage = ((item.count / total) * 100).toFixed(2);
                const color = getCategoryColor(itemName, index);

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-white shadow-sm p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                      <span className="font-semibold text-gray-700">{itemName}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentage}% <span className="font-bold ml-2">{item.count} sessions</span>
                    </div>
                  </li>
                );
              });
            })()}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;