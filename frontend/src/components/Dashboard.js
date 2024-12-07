import React from "react";
import Navbar2 from "./Navbar2.js"

const DashboardPage = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen text-gray-800">
      {/* Header Navigation */}
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <Navbar2 />
      </header>

      <main className="space-y-8">
        {/* Top Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-600 text-sm">Sessions</h2>
            <p className="text-2xl font-bold text-purple-600">14,930</p>
            <p className="text-gray-500 text-sm">147 bot sessions excluded</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-600 text-sm">Pages per session</h2>
            <p className="text-2xl font-bold text-purple-600">1.13</p>
            <p className="text-gray-500 text-sm">average</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-600 text-sm">Scroll depth</h2>
            <p className="text-2xl font-bold text-purple-600">77.56%</p>
            <p className="text-gray-500 text-sm">average</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-600 text-sm">Active time spent</h2>
            <p className="text-2xl font-bold text-purple-600">34 sec</p>
            <p className="text-gray-500 text-sm">out of 2:1 total time</p>
          </div>
        </section>

        {/* User Overview and Insights */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-purple-600 mb-4">
              User Overviews
            </h3>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Live users</span>
                <span className="text-purple-600">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total sessions</span>
                <span className="text-purple-600">1326</span>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-purple-600 mb-4">Insights</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Rage clicks</span>
                <span className="text-purple-600">0.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dead clicks</span>
                <span className="text-purple-600">9.13%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Scrolling</span>
                <span className="text-purple-600">0.7%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quick clicks</span>
                <span className="text-purple-600">0.7%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Events and Your Project */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-purple-600 mb-4">
              Smart Events
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">Downloads</span>
                <span className="text-purple-600">8 sessions</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Sign up</span>
                <span className="text-purple-600">8 sessions</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Contact us</span>
                <span className="text-purple-600">2 sessions</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Login</span>
                <span className="text-purple-600">8 sessions</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-purple-600 mb-4">
              Your Project
            </h3>
            <div className="flex items-center">
              <div className="w-2/3">
                <p className="text-gray-600">Heatmap</p>
                <p className="text-gray-600">CSS Customization</p>
              </div>
              <div className="w-1/3">
                <div className="rounded-full bg-purple-300 text-center">
                  63% Heatmap
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
