import React from 'react';
import Navbar2 from './Navbar2.js';

const CSS_Customization = () => {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-purple-200 min-h-screen text-gray-800">
    {/* Navbar */}
    <header>
    <Navbar2/>
    </header>

      {/* Main Content */}
            
      <main className="py-12 px-8 md:px-20">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          AuraX | CSS Customization
        </span>
        </h1>
        
        {/* URL Input Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="url" className="text-gray-700 font-medium">URL is</label>
            <input
              type="text"
              id="url"
              placeholder="https://www.aurax.com/"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>

          {/* Embedded Preview Section */}
          <div className="mt-8">
            <div className="border rounded-lg overflow-hidden shadow-md">
              <div className="bg-gray-100 px-4 py-2 font-medium">AuraX</div>
              <div className="p-4 bg-white">
                <h2 className="text-lg font-semibold text-purple-600">Welcome to AuraX: Design Smarter with User Data</h2>
                <p className="text-gray-600 mt-2">
                  AuraX analyzes user interactions to reveal patterns and provide design improvements, making your site both
                  engaging and optimized for conversions.
                </p>
                <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg">Continue</button>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Color Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-purple-600">Primary Color</h2>
          <p className="text-gray-600 mt-2">
            The primary color is "blue" and is used across all interactive elements such as buttons, links, inputs, etc.
          </p>

          <div className="mt-4 flex space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-500"></div>
            <div className="w-12 h-12 rounded-full bg-blue-700"></div>
            <div className="w-12 h-12 rounded-full bg-blue-300"></div>
          </div>
        </div>

        {/* Code Snippet Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-medium text-purple-600">Get started with tag installation</h2>
          <div className="mt-4 bg-gray-100 rounded-lg p-4">
            <pre className="text-sm text-gray-800">
              <code>{`body {
  background-color: rgb(255, 87, 51);
  color: rgba(255, 255, 255, 0.8);
}`}</code>
            </pre>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg">Copy to clipboard</button>
          </div>
        </div>
      </main>
    </div>
    
  );
};

export default CSS_Customization;
