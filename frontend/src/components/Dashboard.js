import React, { useState, useEffect } from "react";
import Navbar2 from "./Navbar2.js";
import { useNavigate } from "react-router-dom";

const metrics = [
  { title: "Sessions", value: "14,930", note: "147 bot sessions excluded" },
  { title: "Pages per session", value: "1.13", note: "average" },
  { title: "Scroll depth", value: "77.56%", note: "average" },
  { title: "Active time spent", value: "34 sec", note: "out of 2.1 total time" },
];

const browsers = [
  { name: "Chrome", color: "bg-sky-400" },
  { name: "Edge", color: "bg-rose-300" },
  { name: "Safari", color: "bg-green-400" },
  { name: "Chrome Mobile", color: "bg-red-500" },
  { name: "Mobile Safari", color: "bg-purple-500" },
  { name: "Others", color: "bg-gray-700" },
];

const Dashboard = (props) => {
  const [metricsState, setMetrics] = useState([]);  
  const [insights, setInsights] = useState([]);
  const [distributions, setDistributions] = useState({});
  const [loading, setLoading] = useState(true);
  const [projectId, setProjectId] = useState(null);
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
        setMetrics(data.metrics || []);
        setInsights(data.insights || []);
        setDistributions(data.distributions || {});
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
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
              <p className="text-3xl font-bold text-[#6e57e0]">{metric.value}</p>
              <span className="text-gray-400 text-sm">{metric.note}</span>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-[#6e57e0]">Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
                <span className="text-gray-700 text-lg font-semibold">{insight.label}</span>
                <span className="text-[#6e57e0] text-2xl font-bold">{insight.value}</span>
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
                  63%
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
        className={`px-4 py-2 font-semibold ${
          tab === "Browsers"
            ? "text-[#6e57e0] border-b-2 border-[#6e57e0]"
            : "text-gray-400"
        }`}
      >
        {tab}
      </button>
    ))}
  </nav>

  {/* Browsers Content */}
  <h2 className="text-2xl font-semibold mb-4 text-[#6e57e0]">Browsers</h2>
  <div className="flex flex-col items-center">
    {/* Donut Chart */}
    <div className="relative w-78 h-78 mb-8 lg:mb-0 lg:mr-8 flex justify-between items-center">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        {/* Base circle */}
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          className="fill-none stroke-purple-300"
          strokeWidth="3"
        />
        {/* Data circles */}
        {browsers.map((browser, index) => (
          <circle
            key={index}
            cx="18"
            cy="18"
            r="15.9155"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`12 88`} 
            strokeDashoffset={index * -15}
            className={browser.color}
          />
        ))}
      </svg>
    </div>

    {/* Browser Stats */}
    <div className="flex-1">
      <div className="space-y-2">
        {browsers.map((browser, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-0 border-b last:border-b-0"
          >
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Stats Display Below Donut Chart */}
  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">Overall Stats</h3>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {browsers.map((browser, index) => (
        <li
          key={index}
          className="flex items-center justify-between bg-white shadow-sm p-3 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${browser.color}`}></div>
            <span className="font-semibold text-gray-700">{browser.name}</span>
          </div>
          <div className="text-sm text-gray-600">
            72.41% <span className="font-bold ml-2">14,791 sessions</span>
          </div>
        </li>
      ))}
    </ul>
  </div>
</div>

      </main>
    </div>
  );
};

export default Dashboard;