import React, { useState } from "react";
import Navbar2 from "./Navbar2";

const HeatmapPage = () => {
  const [selectedPage, setSelectedPage] = useState("Home Page");
  const [searchQuery, setSearchQuery] = useState("");

  const heatmapData = {
    "Home Page": "website.jpeg",
    "Returning Users": "/path/to/returning-users-heatmap-image.png",
    "Contact Page": "/path/to/contact-page-heatmap-image.png",
    "Products Page - 10 Days Ago": "/path/to/products-page-10-days-image.png",
    "Products Page - 1 Month Ago": "/path/to/products-page-1-month-image.png",
  };

  const handleNewHeatmap = () => {
    alert("New heatmap functionality coming soon!");
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 to-purple-300 min-h-screen text-gray-800">
      {/* Header Navigation */}
      <header>
        <Navbar2 />
      </header>

             {/* Main Content */}
      <main className="py-12 px-8 md:px-20">
      <div className="none">
        {/* Page Title and Search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-purple-800 pl-1">AuraX | Heatmap</h1>
          <div className="flex items-center space-x-4">
            <select className="border border-gray-300 rounded-md px-4 py-2">
              <option value="URL is">URL is</option>
            </select>
            <input
              type="text"
              placeholder="https://www.aurax.com/"
              className="border border-gray-300 rounded-md px-4 py-2 w-80"
            />
            <button
              className="border border-gray-300 px-4 py-2 rounded-md text-gray-500 hover:text-gray-700"
              onClick={() => setSearchQuery("")}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-1/4 h-* bg-white shadow-md rounded-md p-8">
            <button
              onClick={handleNewHeatmap}
              className="block w-full text-left px-4 py-2 bg-purple-500 text-white font-semibold rounded-md mb-4"
            >
              + New Heatmap
            </button>
            <ul className="space-y-2">
              {Object.keys(heatmapData)
                .filter((page) => page.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((page) => (
                  <li
                    key={page}
                    className={`px-4 py-2 rounded-md cursor-pointer font-medium ${
                      selectedPage === page ? "bg-purple-100 text-purple-800" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedPage(page)}
                  >
                    {page}
                  </li>
                ))}
            </ul>
          </aside>

          {/* Heatmap Viewer */}
          <main className="w-3/4 flex justify-center items-center bg-white shadow-md rounded-md ml-8 p-6">
            <img
              src={heatmapData[selectedPage]}
              alt={`${selectedPage} Heatmap`}
              className="w-full h-auto max-h-[500px] object-contain rounded-md border border-gray-200"
            />
          </main>
        </div>
      </div>
      </main>
    </div>
  );
};

export default HeatmapPage;