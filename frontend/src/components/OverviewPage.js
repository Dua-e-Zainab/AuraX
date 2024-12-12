import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar2 from "./Navbar2.js";

const OverviewPage = () => {
  const { id } = useParams(); 
  const [copySuccess, setCopySuccess] = useState(""); 

  // Function to handle copy to clipboard
  const handleCopyToClipboard = () => {
    const scriptCode = `<script type="text/javascript">
  (function(a,u,r,a,x){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.aurax.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window,document,"aurax","script","oc5w7q0866");
</script>`;
    navigator.clipboard.writeText(scriptCode).then(
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
      <header className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <Navbar2 />
      </header>

      {/* Main Content */}
      <main className="py-12 px-8 md:px-20">
        {/* Hero Section */}
        <section className="text-left mb-12">
          <h2 className="text-4xl font-bold text-purple-600">
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
                    {`<script type="text/javascript">
  (function () {
    // Function to generate a unique session ID for each user session
    function generateSessionId() {
      if (!sessionStorage.getItem("session_id")) {
        sessionStorage.setItem("session_id", "session_" + new Date().getTime());
      }
      return sessionStorage.getItem("session_id");
    }

    // Function to get the user agent details (Device, OS, Browser)
    function getUserInfo() {
      const userAgent = navigator.userAgent;
      const os = navigator.platform;
      const device = /Mobi|Android|Touch/i.test(userAgent) ? 'Mobile' : 'Desktop';
      const browser = userAgent.match(/(firefox|msie|chrome|safari|opera|trident)/i)[0];
      return {
        os: os,
        device: device,
        browser: browser,
        userAgent: userAgent
      };
    }

    // Function to get the user's geographical region (optional)
    async function getRegion() {
      try {
        const response = await fetch('https://ipinfo.io?token=YOUR_API_TOKEN'); // You can use a geolocation API
        const data = await response.json();
        return data.region || 'Unknown';
      } catch (error) {
        return 'Unknown';
      }
    }

    // Function to capture mouse or touch events
    function trackEvent(event) {
      const x = event.clientX || (event.touches ? event.touches[0].clientX : 0);
      const y = event.clientY || (event.touches ? event.touches[0].clientY : 0);

      const userInfo = getUserInfo();
      const sessionId = generateSessionId();

      const eventData = {
        x: x,
        y: y,
        eventType: event.type,
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        ...userInfo
      };

      // Send the data to your backend server
      fetch('http://localhost:5000/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      }).catch((error) => console.error('Error sending data:', error));
    }

    // Function to capture scroll events
    function trackScroll() {
      const scrollY = window.scrollY;
      const userInfo = getUserInfo();
      const sessionId = generateSessionId();

      const scrollData = {
        scrollY: scrollY,
        eventType: 'scroll',
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        ...userInfo
      };

      // Send scroll data to backend
      fetch('http://localhost:5000/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scrollData),
      }).catch((error) => console.error('Error sending data:', error));
    }

    // Event listeners for mouse, touch, and scroll events
    window.addEventListener('mousemove', trackEvent); // Track mouse movement
    window.addEventListener('click', trackEvent); // Track mouse clicks
    window.addEventListener('touchstart', trackEvent); // Track touch start
    window.addEventListener('touchmove', trackEvent); // Track touch move
    window.addEventListener('scroll', trackScroll); // Track scroll

    // Optional: Track page load or window resizing events
    window.addEventListener('load', () => {
      getRegion().then((region) => {
        const pageLoadData = {
          eventType: 'load',
          timestamp: new Date().toISOString(),
          sessionId: generateSessionId(),
          region: region,
          ...getUserInfo()
        };

        fetch('http://localhost:5000/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageLoadData),
        }).catch((error) => console.error('Error sending data:', error));
      });
    });
  })();
</script>
`}
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
