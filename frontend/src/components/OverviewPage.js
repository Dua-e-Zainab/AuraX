import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar2 from "./Navbar2.js";

const OverviewPage = () => {
  const { id } = useParams(); 
  const [trackingCode, setTrackingCode] = useState(""); 
  const [copySuccess, setCopySuccess] = useState(""); 

  useEffect(() => {
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
    
            fetch(\`http://localhost:5000/api/track/\${projectId}\`, {
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
                intensity: 1
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
  return (
    <div className="bg-gradient-to-b from-purple-50 to-purple-100 min-h-screen text-gray-800">
      {/* Header Navigation */}
      <header className="ss">
        <Navbar2 />
      </header>

      {/* Main Content */}
      <main className="py-12 px-8 md:px-20">
        {/* Hero Section */}
        <section className="text-left mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Welcome to AuraX - Project Overview
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Simply install the code on your website to enjoy all the features
            and data you need. Setup is fast and hassle-free!
          </p>
          <p className="text-lg text-gray-800 mt-2 font-semibold">
            Project ID: {id}
          </p>
        </section>

        {/* Tag Installation Box */}
        <section className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Get started with tag installation
          </h3>
          <ol className="space-y-4">
            <li className="flex items-start">
              <span className="text-purple-600 font-bold text-lg mr-4">1</span>
              <div className="flex-1">
                <p className="font-medium text-gray-700">Copy this code</p>
                <div className="bg-gray-100 p-4 rounded-md mt-2 relative">
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {trackingCode}
                  </pre>
                  <button
                    onClick={handleCopyToClipboard}
                    className="absolute top-4 right-4 bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700"
                  >
                    Copy to clipboard
                  </button>
                </div>
                {copySuccess && (
                  <p className="text-sm text-green-500 mt-2">{copySuccess}</p>
                )}
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 font-bold text-lg mr-4">2</span>
              <p className="text-gray-700">
                Add the snippet to the &lt;head&gt; of all the pages where you
                want to analyze user actions or collect responses.
              </p>
            </li>
          </ol>
        </section>
        
      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Heatmaps Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={`${process.env.PUBLIC_URL}/maxim.png`}
              alt="Placeholder"
              className="w-full"
            />
            <div className="p-6">
              <h4 className="text-purple-600 font-bold text-lg">Heatmaps</h4>
              <p className="text-gray-600 mt-2">
                Discover which sections of your page boost conversions and which
                elements hinder user experience with AuraX Heatmaps.
              </p>
            </div>
          </div>

          {/* Insights Card */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={`${process.env.PUBLIC_URL}/maxim2.png`}
              alt="Insights"
              className="w-full"
            />
            <div className="p-6">
              <h4 className="text-purple-600 font-bold text-lg">Insights</h4>
              <p className="text-gray-600 mt-2">
                Insights provide a holistic view of your site's performance and
                highlight areas for optimization with AuraX CSS Customization.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Common Questions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-md">
              <p className="text-gray-700">
                Do I need coding knowledge to set up heatmap tracking on my
                site?
              </p>
              <button className="text-purple-600 font-bold text-lg">→</button>
            </div>
            <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-md">
              <p className="text-gray-700">
                Will adding the tracking code affect my website's performance?
              </p>
              <button className="text-purple-600 font-bold text-lg">→</button>
            </div>
            <div className="flex justify-between items-center bg-white shadow-md p-4 rounded-md">
              <p className="text-gray-700">
                How do I install the tracking code on my website?
              </p>
              <button className="text-purple-600 font-bold text-lg">→</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default OverviewPage;