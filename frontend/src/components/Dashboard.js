import React from "react";
import Navbar2 from "./Navbar2.js"

const metrics = [
  { title: "Sessions", value: "14,930", note: "147 bot sessions excluded" },
  { title: "Pages per session", value: "1.13", note: "average" },
  { title: "Scroll depth", value: "77.56%", note: "average" },
  { title: "Active time spent", value: "34 sec", note: "out of 2.1 total time" },
];

const insights = [
  { label: "Rage clicks", value: "0.7%" },
  { label: "Dead clicks", value: "9.13%" },
  { label: "Scrolling", value: "0.7%" },
  { label: "Quick clicks", value: "0.7%" },
];

const browsers = [
  { name: "Chrome", color: "bg-sky-400" },
  { name: "Edge", color: "bg-rose-300" },
  { name: "Safari", color: "bg-green-400" },
  { name: "Chrome Mobile", color: "bg-red-500" },
  { name: "Mobile Safari", color: "bg-purple-500" },
  { name: "Others", color: "bg-gray-700" },
];

const smartEvents = ["Downloads", "Sign up", "Contact us", "Login"];

function Dashboard() {
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

        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <h3 className="text-lg font-semibold mb-2">{metric.title}</h3>
              <p className="text-3xl font-bold text-[#6e57e0]">{metric.value}</p>
              <span className="text-gray-400 text-sm">{metric.note}</span>
            </div>
          ))}
        </div>

{/* insights and overview */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  {/* Left Section - User Overview */}
  <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
    {/* Tabs */}
    <div className="flex border-b mb-4">
      <button className="text-[#6e57e0] font-semibold border-b-2 border-[#6e57e0] px-4 py-2">
        User overviews
      </button>
      <button className="text-gray-400 px-4 py-2">All users</button>
      <button className="text-gray-400 px-4 py-2">User intents</button>
    </div>

    {/* User Cards */}
    <div className="space-y-4">
      {/* Card 1 */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 text-[#6e57e0] p-3 rounded-full">
            {/* Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c.43 0 .83-.15 1.16-.4l.01.01a2 2 0 10-2.36-3.18A2 2 0 0012 8zm0 2c-4.97 0-9 4.03-9 9h18c0-4.97-4.03-9-9-9zm0 0c-3.33 0-6-2.67-6-6S8.67 2 12 2s6 2.67 6 6-2.67 6-6 6z" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#6e57e0]">0</p>
            <p className="text-gray-400">Live users</p>
            <p className="text-sm text-gray-400">1 min ago</p>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 text-[#6e57e0] p-3 rounded-full">
            {/* Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2h-3V4h3V2h-5a2 2 0 00-2 2v16a2 2 0 002 2zM4 18h12v-2H4v2zm0-4h12v-2H4v2zm0-4h12V8H4v2z" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#6e57e0]">1326</p>
            <p className="text-gray-400">Live users</p>
            <p className="text-sm text-gray-400">1 min ago</p>
          </div>
        </div>
      </div>
    </div>

    {/* Progress Bars */}
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-600">Sessions with new users</p>
        <p className="text-gray-600">100% - 11,004</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div className="bg-[#6e57e0] h-2.5 rounded-full" style={{ width: "100%" }}></div>
      </div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-gray-600">Sessions with new users</p>
        <p className="text-gray-600">100% - 11,004</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-[#6e57e0] h-2.5 rounded-full" style={{ width: "100%" }}></div>
      </div>
    </div>
  </div>


          
{/* Insights */}
<div className="bg-white p-8 rounded-lg shadow-md">
  {/* Insights Title */}
  <h2 className="text-2xl font-semibold mb-6 text-[#6e57e0] flex items-center">
    <span className="mr-2">
      {/* Insights Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-[#6e57e0]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M12 18.5c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z"
        />
      </svg>
    </span>
    Insights
  </h2>

  {/* Sequential Sub-Containers */}
  <div className="flex flex-col gap-4">
    {insights.map((insight, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-100 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        {/* Left Side: Icon and Label */}
        <div className="flex items-center space-x-4">
          <div className="bg-[#e8e4fc] text-[#6e57e0] p-3 rounded-full">
            {/* Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c.43 0 .83-.15 1.16-.4l.01.01a2 2 0 10-2.36-3.18A2 2 0 0012 8zm0 2c-4.97 0-9 4.03-9 9h18c0-4.97-4.03-9-9-9zm0 0c-3.33 0-6-2.67-6-6S8.67 2 12 2s6 2.67 6 6-2.67 6-6 6z"
              />
            </svg>
          </div>
          <span className="text-gray-700 text-lg font-semibold">
            {insight.label}
          </span>
        </div>

        {/* Right Side: Value */}
        <span className="text-[#6e57e0] text-2xl font-bold">{insight.value}</span>
      </div>
    ))}
  </div>
</div>
</div>

        {/* Smart Events and Project */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Smart Events */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Smart Events</h2>
            {smartEvents.map((event, index) => (
              <div
                key={index}
                className="flex justify-between text-gray-600 mb-2"
              >
                <span>{event}</span>
                <span className="font-bold">8 sessions</span>
              </div>
            ))}
          </div>

          {/* Your Project */}
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
}
export default Dashboard;