// src/pages/ProjectPage.js
import React, { useState, useEffect } from 'react';
import Navbar1 from './Navbar1.js';
import { Link } from 'react-router-dom';

const ProjectPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-violet-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-100/20 to-blue-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <div className={`relative z-10 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <Navbar1 />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        
        {/* Hero Image Container */}
        <div className={`relative mb-8 sm:mb-12 transition-all duration-1200 delay-300 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
          <div className="relative group">
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-violet-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Image container with loading state */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/50">
              {!imageLoaded && (
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
              )}
              <img
                src="welbanner.png"
                alt="Welcome to AuraX - Project Management Platform"
                className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl h-auto rounded-xl shadow-lg transition-all duration-700 hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className={`text-center mb-8 sm:mb-10 transition-all duration-1000 delay-600 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Welcome to AuraX
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-md mx-auto leading-relaxed px-4">
            Transform your ideas into reality. Begin your journey by creating your first project.
          </p>
        </div>
        
        {/* CTA Button */}
        <div className={`transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <Link to="/CreateProject" className="group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-300 group-hover:duration-200 animate-pulse"></div>
            <button className="relative flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-violet-500 text-white text-base sm:text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-violet-600 active:scale-95">
              <span className="mr-3 text-xl sm:text-2xl font-bold bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-transform group-hover:rotate-90 duration-300">
                +
              </span>
              <span className="relative">
                New Project
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/50 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          </Link>
        </div>

        {/* Additional Features Hint */}
        <div className={`mt-12 sm:mt-16 text-center transition-all duration-1000 delay-1200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2 hover:text-indigo-600 transition-colors duration-300 cursor-default">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              <span>Collaborative Workspace</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-purple-600 transition-colors duration-300 cursor-default">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-300"></div>
              <span>Real-time Updates</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-violet-600 transition-colors duration-300 cursor-default">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse delay-700"></div>
              <span>Smart Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Hint */}
      <div className={`fixed bottom-8 right-8 transition-all duration-1000 delay-1500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} hidden lg:block`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <div className="w-6 h-6 text-gray-600 group-hover:text-indigo-600 transition-colors duration-300">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;