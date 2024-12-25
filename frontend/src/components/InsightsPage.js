import React from "react";
import Navbar2 from "./Navbar2";

const InsightsPage = () => {
  return (
    <div className="bg-gradient-to-b from-purple-100 to-purple-200 min-h-screen font-sans">
      {/* Navbar */}
      <header>
      <Navbar2 />
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6 mt-6 py-12 px-8 md:px-20">
        {/* Sidebar Ranking */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-lg font-semibold text-gray-600">
            Ranked by most clicks
          </h2>
          <div className="space-y-2">
            {[
              { label: "Sign up", clicks: 100 },
              { label: "Login", clicks: 50 },
              { label: "Enter website URL", clicks: 11 },
              { label: "Continue", clicks: 11 },
              { label: "Register yourself", clicks: 10 },
              { label: "Products", clicks: 15 },
              { label: "Help", clicks: 5 },
              { label: "Solutions", clicks: 11 },
              { label: "Customers", clicks: 11 },
              { label: "Aurax logo", clicks: 35 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border border-gray-300 bg-white rounded-lg shadow-sm"
              >
                <span className="font-medium">
                  {index + 1}. {item.label}
                </span>
                <span className="text-purple-500">{item.clicks} clicks</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Visualization */}
        <div className="col-span-9 space-y-6">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-700">
                Welcome to AuraX: Design Smarter with User Data
              </h2>
              <p className="text-gray-500 mb-4">
                AuraX analyzes user interactions to reveal patterns and improve
                design experiences.
              </p>
              <div className="flex justify-center items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter your website URL"
                  className="border rounded-l-lg px-4 py-2 focus:outline-none"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-r-lg">
                  Continue
                </button>
              </div>
            </div>
            <div className="bg-purple-500 py-4 text-white flex justify-around">
              <div>
                <p className="font-semibold">20,000</p>
                <p>Total page views</p>
              </div>
              <div>
                <p className="font-semibold">16,000</p>
                <p>Total clicks</p>
              </div>
            </div>
          </div>

          {/* Smart Events */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Smart Events</h3>
            <ul className="space-y-2 text-gray-600">
              {["Downloads", "Sign up", "Contact us", "Login"].map(
                (event, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span>{event}</span>
                    <span>8 sessions</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Activity Levels</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-3/4 bg-red-500 h-3 rounded"></div>
                <span>High Activity - 90%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2/4 bg-purple-500 h-3 rounded"></div>
                <span>Moderate Activity - 60%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1/4 bg-orange-400 h-3 rounded"></div>
                <span>Low Activity - 40%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-0 bg-gray-300 h-3 rounded"></div>
                <span>No Activity - 0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
