import React, { useState, useEffect } from "react";
import Navbar2 from "./Navbar2.js";

const Dashboard = (props) => {
  const [metrics, setMetrics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [distributions, setDistributions] = useState({});
  const [loading, setLoading] = useState(true);
  const projectId = props.projectId || localStorage.getItem("projectId");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!projectId) {
        console.error("No projectId found. Ensure it is passed or stored in localStorage.");
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
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
    return <div className="text-center text-xl mt-10">Loading dashboard...</div>;
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
      <header className="ss">
      <Navbar2/>
      </header>

      {/* Main Dashboard */}
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

        {/* Distributions Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["os", "browsers", "devices"].map((type, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-[#6e57e0]">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
              <ul>
                {(distributions[type] || []).map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
                    <span className="text-gray-700">{item[type.slice(0, -1)] || item.browser || item.os || item.device}</span>
                    <span className="text-[#6e57e0] font-bold">{item.count} sessions</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
