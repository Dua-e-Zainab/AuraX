import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar2 from "./Navbar2.js";

const OverviewPage = () => {
  const { id } = useParams(); 
  const [trackingCode, setTrackingCode] = useState(""); 
  const [copySuccess, setCopySuccess] = useState(""); 
  const [isLoading, setIsLoading] = useState(true);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    // Generate the tracking code dynamically
    const generateTrackingCode = () => {
      const dynamicCode = `<script>
        (function () {
          const projectId = "${id}";
          const sessionId = (() => {
            let sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
              sessionId = 'sess-' + Math.random().toString(36).substr(2, 9);
              localStorage.setItem('sessionId', sessionId);
            }
            return sessionId;
          })();
    
          let rageClicks = 0, deadClicks = 0, quickClicks = 0;
          const clickTrackingData = {};
    
          const trackClickPerformance = (x, y) => {
            const key = \`\${Math.round(x)},\${Math.round(y)}\`;
            const currentTime = Date.now();
    
            const clickData = clickTrackingData[key] = clickTrackingData[key] || {
              clicks: 0,
              lastClickTime: 0,
              clickTimes: [],
              rageClicks: 0,
              deadClicks: 0,
              quickClicks: 0,
            };
    
            const timeSinceLastClick = currentTime - clickData.lastClickTime;
            if (timeSinceLastClick < 500) {
              clickData.rageClicks++;
              rageClicks++;
            }
    
            clickData.clickTimes.push(currentTime);
            clickData.clickTimes = clickData.clickTimes.filter(time => currentTime - time <= 2000);
            if (clickData.clickTimes.length > 2) {
              clickData.quickClicks++;
              quickClicks++;
            }
    
            const isClickOnActionableArea = (x, y) => {
              const { innerWidth, innerHeight } = window;
              const clickableArea = {
                x: innerWidth / 3,
                y: innerHeight / 3,
                width: innerWidth / 3,
                height: innerHeight / 3,
              };
              return (
                x > clickableArea.x && x < clickableArea.x + clickableArea.width &&
                y > clickableArea.y && y < clickableArea.y + clickableArea.height
              );
            };
    
            if (!isClickOnActionableArea(x, y)) {
              clickData.deadClicks++;
              deadClicks++;
            }
    
            clickData.lastClickTime = currentTime;
            clickData.clicks++;
          };
    
          document.addEventListener('click', (event) => {
            const x = event.pageX;
            const y = event.pageY;
    
            trackClickPerformance(x, y);
    
            const getBrowser = () => {
              const ua = navigator.userAgent;
              if (/Edg\\//.test(ua)) return "Edge";
              if (/Chrome\\//.test(ua) && !/Edg\\//.test(ua)) return "Chrome";
              if (/Firefox\\//.test(ua)) return "Firefox";
              if (/Safari\\//.test(ua) && !/Chrome\\//.test(ua)) return "Safari";
              if (/Opera|OPR\\//.test(ua)) return "Opera";
              return "Unknown";
            };
    
            const getDeviceType = () => {
              const ua = navigator.userAgent;
              if (/Tablet|iPad/i.test(ua)) return "Tablet";
              if (/Mobi|Android|iPhone/i.test(ua)) return "Mobile";
              return "Desktop";
            };
    
            fetch(\`https://aura-x.up.railway.app/api/track/\${projectId}\`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                projectId,
                sessionId,
                x,
                y,
                eventType: "click",
                timestamp: new Date().toISOString(),
                os: navigator.platform,
                browser: getBrowser(),
                device: getDeviceType(),
                rageClicks,
                deadClicks,
                quickClicks,
                intensity: 1,
                page: window.location.pathname,
              }),
            }).then(response => {
              if (response.ok) {
                console.log("Data sent successfully:", { x, y });
              } else {
                console.error("Failed to send data:", response.status);
              }
            }).catch(error => console.error("Error sending data:", error));
          });
    
          window.addEventListener("scroll", () => {
            parent.postMessage(
              {
                type: "SCROLL_EVENT",
                scrollX: window.scrollX,
                scrollY: window.scrollY,
              },
              "*"
            );
          });
        })();
      </script>`;
    
      setTrackingCode(dynamicCode);
    };    
    
    generateTrackingCode();
    
    return () => clearTimeout(timer);
  }, [id]); 

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(trackingCode).then(
      () => {
        setCopySuccess("Code copied to clipboard!");
        setTimeout(() => setCopySuccess(""), 3000);
      },
      () => {
        setCopySuccess("Failed to copy code. Please try again.");
        setTimeout(() => setCopySuccess(""), 3000);
      }
    );
  };

  // Loading Component
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 absolute top-2 left-2 animate-pulse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading your project...</p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 min-h-screen text-gray-800 overflow-x-hidden">
      {/* Header Navigation */}
      <header className="ss animate-fade-in">
        <Navbar2 />
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 md:px-12 lg:px-20 animate-slide-up">
        {/* Hero Section */}
        <section className="text-center sm:text-left mb-8 md:mb-12 transform transition-all duration-700 animate-fade-in-up">
          <div className="max-w-4xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text leading-tight mb-4">
              Welcome to AuraX
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Project Overview
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-3xl leading-relaxed">
              Simply install the code on your website to enjoy all the features
              and data you need. Setup is fast and hassle-free!
            </p>
            <div className="mt-6 p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-lg inline-block">
              <p className="text-lg sm:text-xl text-gray-800 font-semibold flex items-center justify-center sm:justify-start">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
                Project ID: <span className="text-purple-600 ml-2">{id}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Tag Installation Box */}
        <section className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8 mb-8 md:mb-12 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] animate-slide-in-left">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
              🚀
            </span>
            Get started with tag installation
          </h3>
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start group">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 sm:mb-0 sm:mr-6 group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="flex-1 w-full">
                <p className="font-semibold text-gray-700 mb-3 text-lg">Copy this code</p>
                <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 relative overflow-hidden group-hover:border-purple-300 transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                    <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                      JavaScript Tracking Code
                    </span>
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors duration-200 flex items-center"
                    >
                      {showCode ? '👁️ Hide' : '👁️ Show'} Code
                    </button>
                  </div>
                  
                  {showCode && (
                    <div className="animate-fade-in">
                      <pre className="text-xs sm:text-sm text-gray-700 overflow-x-auto bg-white p-4 rounded-lg border max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {trackingCode}
                      </pre>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCopyToClipboard}
                    className="w-full sm:w-auto mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <span className="mr-2">📋</span>
                    Copy to clipboard
                  </button>
                  
                  {copySuccess && (
                    <p className="text-sm text-green-600 mt-3 font-medium animate-bounce flex items-center">
                      <span className="mr-2">✅</span>
                      {copySuccess}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start group">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 sm:mb-0 sm:mr-6 group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  Add the snippet to the <code className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">&lt;head&gt;</code> of all the pages where you
                  want to analyze user actions or collect responses.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 md:mb-12">
          {/* Heatmaps Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.05] group animate-slide-in-right">
            <div className="relative overflow-hidden">
              <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center">
                <div className="text-6xl sm:text-8xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                  🔥
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="p-6">
              <h4 className="text-purple-600 font-bold text-lg sm:text-xl mb-3 flex items-center">
                <span className="mr-2">📊</span>
                Heatmaps
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Discover which sections of your page boost conversions and which
                elements hinder user experience with AuraX Heatmaps.
              </p>
            </div>
          </div>

          {/* Insights Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.05] group animate-slide-in-left">
            <div className="relative overflow-hidden">
              <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center">
                <div className="text-6xl sm:text-8xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                  💡
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="p-6">
              <h4 className="text-purple-600 font-bold text-lg sm:text-xl mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Insights
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Insights provide a holistic view of your site's performance and
                highlight areas for optimization with AuraX CSS Customization.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="animate-fade-in-up">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-3 text-2xl">❓</span>
            Common Questions
          </h3>
          <div className="space-y-4">
            {[
              "Do I need coding knowledge to set up heatmap tracking on my site?",
              "Will adding the tracking code affect my website's performance?",
              "How do I install the tracking code on my website?"
            ].map((question, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/80 backdrop-blur-sm shadow-lg p-4 sm:p-6 rounded-xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <p className="text-gray-700 mb-3 sm:mb-0 sm:mr-4 flex-1 font-medium">
                  {question}
                </p>
                <button className="text-purple-600 font-bold text-xl group-hover:text-purple-800 group-hover:transform group-hover:translate-x-2 transition-all duration-200 self-end sm:self-center">
                  →
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-in-left {
          from { 
            opacity: 0;
            transform: translateX(-30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-in-right {
          from { 
            opacity: 0;
            transform: translateX(30px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.7s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.7s ease-out;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
        }
      `}</style>
    </div>
  );
};

export default OverviewPage;