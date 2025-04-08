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
    { name: "Chrome", value: 120, color: "#3b82f6" },  // Hex color for blue
    { name: "Edge", value: 40, color: "#f43f5e" },    // Hex color for rose
    { name: "Firefox", value: 20, color: "#f87171" },  // Hex color for red
    // Add more browsers as needed...
  ]);
  const navigate = useNavigate();  // To redirect

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

        // Combine real browser data with colors (Now with hex colors)
        const browserColors = {
          Chrome: "#3b82f6",  // Hex color for blue
          Edge: "#f43f5e",    // Hex color for rose
          Safari: "#34d399",   // Hex color for green
          "Chrome Mobile": "#ef4444", // Hex color for red
          "Mobile Safari": "#9333ea", // Hex color for purple
          Others: "#6b7280",   // Hex color for gray
        };

        const enrichedBrowserData = (data.distributions?.browsers || []).map((b) => ({
          name: b.browser || "Others",
          value: b.count,
          color: browserColors[b.browser] || browserColors["Others"], // Map to hex color value
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
        {/* Circular Loader */}
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
  
  // Calculate average clicks per session (as an example, no percentage calculation)
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

        {/* Insights Section - Matches UI Exactly */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#6e57e0]">Insights</h2>

          <div className="space-y-6">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center bg-gray-100 p-5 rounded-lg shadow-md">
                {/* Icon on Left */}
                <div className="p-3 bg-[#6e57e0] text-white rounded-full">
                  {index === 0 && <Lightbulb size={24} />}
                  {index === 1 && <TrendingUp size={24} />}
                  {index === 2 && <Clock size={24} />}
                  {index === 3 && <Eye size={24} />}
                </div>

                {/* Text on Right */}
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
                  {clicksPerSession.toFixed(2)} {/* Displaying the average clicks per session */}
                </div>
              </div>
              <p className="mt-4 text-gray-400">Heatmaps</p>
            </div>
          </div>
        </div>

        {/* Browsers Section */}
        <div className="bg-white p-8 rounded-lg shadow-md mt-8">
          {/* Tabs Navbar */}
          <nav className="flex border-b mb-6">
          {["Browsers", "Countries", "Desktops", "Operating Systems"].map((tab, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveTab(tab);
                setSelectedTab(tab);
              }}              
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

          {/* Browsers Content */}
          <h2 className="text-2xl font-semibold mb-4 text-[#6e57e0]">{selectedTab}</h2>
          <div className="flex flex-col items-center">
            {/* Donut Chart */}
            <div className="relative w-78 h-78 mb-8 lg:mb-0 lg:mr-8 flex justify-between items-center">
              <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                {/* Donut chart slices */}
                  {(distributions[selectedTab.toLowerCase()] || [])
                    .filter((item) => item.count > 0)
                    .map((item, index, arr) => {
                      const total = arr.reduce((acc, i) => acc + i.count, 0);
                      const percentage = ((item.count / total) * 100).toFixed(2);
                      const dash = (percentage * 100) / 100;
                      const gap = 100 - dash;
                      const dashArray = `${dash} ${gap}`;
                      const offset = arr
                        .slice(0, index)
                        .reduce((acc, i) => acc + ((i.count / total) * 100), 0);

                      // Assign colors like browser chart
                      const colors = ["#3b82f6", "#f43f5e", "#34d399", "#9333ea", "#ef4444", "#6b7280"];
                      const color = colors[index % colors.length];

                    return (
                      <circle
                        key={index}
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke={color}
                        strokeWidth="3"
                        strokeDasharray={dashArray}
                        strokeDashoffset={offset}
                        fill="none"
                      />
                    );
                  })}
              </svg>
            </div>

            {/* Browser Stats Placeholder if needed */}
            <div className="flex-1">
              <div className="space-y-2"></div>
            </div>
          </div>

          {/* Stats Display Below Donut Chart */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Overall Stats</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(distributions[selectedTab.toLowerCase()] || [])
              .filter((item) => item.count > 0)
              .map((item, index, arr) => {
                const total = arr.reduce((acc, i) => acc + i.count, 0);
                const percentage = ((item.count / total) * 100).toFixed(2);
                const colors = ["#3b82f6", "#f43f5e", "#34d399", "#9333ea", "#ef4444", "#6b7280"];
                const color = colors[index % colors.length];

                return (
                  <li
                    key={index}
                    className="flex items-center justify-between bg-white shadow-sm p-3 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                      <span className="font-semibold text-gray-700">{item[selectedTab.toLowerCase().slice(0, -1)] || "Other"}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentage}% <span className="font-bold ml-2">{item.count} sessions</span>
                    </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
