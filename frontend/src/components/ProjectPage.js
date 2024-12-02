// src/pages/ProjectPage.js
import React from 'react';
import Navbar1 from './Navbar1.js';
import { Link } from 'react-router-dom';

const ProjectPage = () => {
  return (
    // <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-100 to-indigo-100">
    <div className="font-sans bg-[#f4f7fe] text-gray-800 bg-gradient-to-b from-indigo-100 to-violet-200 h-screen justify-center">
        <Navbar1 />
      {/* <header className="flex justify-between w-full px-8 py-4 text-indigo-900 bg-white">
        <img src = "Logo - AuraX 22.png" alt="img"/>
        <div className="flex items-center space-x-8">
          <Link to="/projects" className="hover:underline">My Projects</Link>
          <Link to="/help" className="hover:underline">Help</Link>
          <button
            aria-label="User Profile"
            className="w-8 h-8 bg-indigo-200 rounded-full flex items-center justify-center"
          >
            <span className="sr-only">User Profile</span>
          </button>
        </div>
      </header> */}
      
        <div className="flex flex-col items-center mt-1">
          <img
            src="welbanner.png"
            alt="Illustration of Animals"
            className="mb-8"
            style={{
              width: '790px', 
              height: '420px', 
            }}
          />
        <h2 className="text-x1 font-medium text-gray-600 mb-4">
          Welcome to AuraX, begin by adding a new project
        </h2>
        
        <Link to="/CreateProject">
          <button className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg rounded-lg hover:from-blue-600 hover:to-purple-600 transition">
            <span className="mr-2 text-2xl font-bold">+</span>
             New Project
          </button>
        </Link>
        </div>
      </div>
  );
};

export default ProjectPage;
