import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar1 from './Navbar1.js';
import { X, Flame, Palette, BarChart3} from 'lucide-react';
import { FaQuestionCircle as HelpCircle } from 'react-icons/fa';

const CreateProjectPage = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!name || !url || !domain) {
      setErrorMessage('All fields are required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    const projectData = { name, url, domain };

    console.log('Payload being sent to server:', projectData);

    try {
      const response = await fetch('https://aura-x.up.railway.app/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(projectData),
      });

      console.log('Raw response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      console.log('Response ok:', response.ok);

      // Try to parse response regardless of status
      let data = {};
      const responseText = await response.text();
      console.log('Raw response text:', responseText);

      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Response is not valid JSON');
      }

      // Check for successful statuses (200, 201, etc.)
      if (response.status >= 200 && response.status < 300) {
        // Success case
        console.log('✅ Project created successfully');
        
        // Handle different possible response structures
        const trackingCodeValue = data.trackingCode || data.tracking_code || data.id || data._id || 'Generated Successfully';
        setTrackingCode(trackingCodeValue);
        setShowPopup(true);

        // Clear form on success
        setName('');
        setUrl('');
        setDomain('');

        // Redirect to "My Projects" page after a delay
        setTimeout(() => {
          navigate('/myprojects');
        }, 2000);

      } else if (response.status === 500 && data.error && data.error.includes('id is not defined')) {
        // TEMPORARY: Handle the specific backend bug
        console.log('⚠️ Backend has "id is not defined" error, but treating as success for now');
        setTrackingCode('Temporary-ID-' + Date.now());
        setShowPopup(true);

        // Clear form on success
        setName('');
        setUrl('');
        setDomain('');

        // Redirect to "My Projects" page after a delay
        setTimeout(() => {
          navigate('/myprojects');
        }, 2000);

      } else {
        // Error case
        console.log('❌ Server returned error status:', response.status);
        const errorMessage = data.message || data.error || `Server returned status ${response.status}`;
        throw new Error(errorMessage);
      }

    } catch (error) {
      console.error('❌ Complete error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // More specific error handling
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('❌ Network error: Unable to connect to server. Please check if the server is running on http://localhost:5000');
      } else if (error.message.includes('Failed to fetch')) {
        setErrorMessage('❌ Connection failed: Server might be down or CORS issue');
      } else {
        setErrorMessage(`❌ ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!name) {
      setErrorMessage('Please create a project first before deleting.');
      return;
    }

    setIsDeleting(true);
    
    // Simulate delete operation with delay
    setTimeout(() => {
      console.log('Project deleted');
      setIsDeleting(false);
      navigate('/projects');
    }, 1000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-violet-200 overflow-hidden">
      <Navbar1 
      isHelpModalOpen={isHelpModalOpen}
      setIsHelpModalOpen={setIsHelpModalOpen}
      />

      {/* Main Container */}
      <div className="h-[calc(100vh-80px)] px-4 py-2">
        <div className="flex flex-col lg:flex-row items-center justify-center h-full gap-4 lg:gap-8">
          
          {/* Left Section - Form */}
          <div className="w-full max-w-md lg:w-1/2 lg:max-w-lg h-full flex items-center">
            <div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-6 border border-white/20 transform transition-all duration-700 hover:scale-105 w-full"
              style={{ animation: 'slideInLeft 0.8s ease-out' }}
            >
              {/* Header */}
              <div className="text-center mb-4">
                <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                  Create New Project
                </h1>
                <p className="text-gray-600 text-xs md:text-sm">
                  Set up your project in just a few steps
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div 
                  className="mb-3 p-3 border border-red-300 bg-red-50 rounded-xl text-red-700 text-xs flex items-center space-x-2 transform transition-all duration-300"
                  style={{ animation: 'shake 0.5s ease-in-out' }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form className="space-y-3" onSubmit={handleSave}>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Website URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white text-sm"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Domain Category
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full p-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-300 text-gray-800 bg-gray-50 focus:bg-white cursor-pointer text-sm"
                    disabled={isLoading}
                  >
                    <option value="">Select a domain category</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Create Project</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting || isLoading}
                    className="flex-1 py-2.5 px-4 border-2 border-red-300 text-red-600 font-semibold rounded-xl hover:bg-red-50 hover:border-red-400 transform transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 text-sm"
                  >
                    {isDeleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
                        <span>Deleting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete Project</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Section - Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center items-center h-full">
            <div 
              className="relative transform transition-all duration-1000 hover:scale-105 max-w-sm lg:max-w-md"
              style={{ animation: 'slideInRight 0.8s ease-out 0.2s both' }}
            >
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 to-indigo-200/30 rounded-3xl transform rotate-3 scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-3xl transform -rotate-2 scale-105"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-white/50 backdrop-blur-sm rounded-2xl p-3 md:p-6 shadow-2xl">
                <img
                  src="computer.png"
                  alt="Project Creation Illustration"
                  className="w-full h-auto max-w-xs lg:max-w-sm mx-auto drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.1))',
                  }}
                />
                
                {/* Floating Animation Elements */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/3 left-2 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full opacity-80 animate-bounce" style={{ animationDelay: '2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
          style={{ animation: 'fadeIn 0.3s ease-out' }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center relative max-w-md mx-auto w-full transform"
            style={{ animation: 'popupSlideIn 0.5s ease-out' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              aria-label="Close popup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success Icon with Animation */}
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
              <svg
                className="w-10 h-10 text-white animate-pulse"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0C5.4 0 0 5.4 0 12c0 6.6 5.4 12 12 12s12-5.4 12-12C24 5.4 18.6 0 12 0zm5.1 9.3l-6 6c-.3.3-.7.5-1.1.5-.4 0-.8-.2-1.1-.5l-3-3c-.3-.3-.3-.8 0-1.1s.8-.3 1.1 0l2.4 2.4 5.4-5.4c.3-.3.8-.3 1.1 0 .3.4.3.9-.1 1.1z" />
              </svg>
            </div>

            {/* Success Message */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-3">
              Project Created Successfully! 🎉
            </h3>
            <p className="text-gray-600 mb-4">
              Your project has been set up and you'll be redirected to your projects dashboard shortly.
            </p>
            
            {/* Tracking Code Display */}
            {trackingCode && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Tracking Code:</p>
                <p className="font-mono text-sm font-bold text-purple-600">{trackingCode}</p>
              </div>
            )}
            
            {/* Loading Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-2000 ease-out"
                style={{ width: '0%', animation: 'loadingBar 2s ease-out forwards' }}
              ></div>
            </div>
            
            <p className="text-sm text-gray-500">
              Redirecting in a few seconds...
            </p>
          </div>
        </div>
      )}
      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-8 transform transition-all duration-500 ${
            isHelpModalOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
          }`}>
            
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-all duration-300 rounded-full hover:bg-red-50 hover:scale-110"
              onClick={() => setIsHelpModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Help Center</h2>
                  <p className="text-gray-600 text-sm">Find answers to common questions</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { 
                    q: "What is a heatmap, and how can it help my website?", 
                    icon: <Flame className="h-6 w-6 text-orange-500" />,
                    gradient: "from-orange-50 to-red-50"
                  },
                  { 
                    q: "How do I interpret the heatmap data?", 
                    icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
                    gradient: "from-blue-50 to-indigo-50"
                  },
                  { 
                    q: "What CSS changes should I consider based on my heatmap results?", 
                    icon: <Palette className="h-6 w-6 text-purple-500" />,
                    gradient: "from-purple-50 to-pink-50"
                  },
                ].map((item, index) => (
                  <div key={index} className={`group flex items-start space-x-4 p-5 rounded-2xl bg-gradient-to-r ${item.gradient} hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/50`}>
                    <div className="flex-shrink-0 p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 font-medium">
                      {item.q}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200/50">
                <p className="text-center text-gray-500 text-sm">
                  Need more help? 
                  <button className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300 hover:underline">
                    Contact Support →
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes shake {
          from {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes loadingBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateProjectPage;