import React, { useState, useEffect, useRef } from "react";
import h337 from "heatmap.js";
import Navbar2 from "./Navbar2";
import { useParams } from "react-router-dom";

const HeatmapPage = () => {
  const { projectId: paramProjectId } = useParams();
  const projectId = paramProjectId || localStorage.getItem("projectId");
  const [projectUrl, setProjectUrl] = useState("");
  const [heatmapData, setHeatmapData] = useState([]);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef(null);
  const heatmapInstance = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [iframeWidth, setIframeWidth] = useState("100%");
  const [tokenExpired, setTokenExpired] = useState(false);

  // Fetch project URL
  useEffect(() => {
    const fetchProjectUrl = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          setTokenExpired(true);
          return;
        }

        const data = await response.json();
        if (response.ok && data.success) {
          setProjectUrl(data.project.url);
        } else {
          console.error("Error fetching project URL:", data.message || "Not Found");
        }
      } catch (err) {
        console.error("Failed to fetch project URL:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectUrl();
  }, [projectId]);

  // Fetch heatmap data
  useEffect(() => {
    const fetchHeatmapData = async () => {
      if (!projectId) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          `http://localhost:5000/api/track/heatmap/${projectId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 401) {
          setTokenExpired(true);
          return;
        }

        if (!response.ok) throw new Error(`Error fetching heatmap data: ${response.statusText}`);

        const data = await response.json();
        setHeatmapData(
          data.data.map((point) => ({
            x: point.x,
            y: point.y,
            value: point.intensity,
          }))
        );
      } catch (error) {
        console.error("Error fetching heatmap data:", error.message);
      }
    };

    fetchHeatmapData();
  }, [projectId]);

  // Render heatmap
  useEffect(() => {
    if (!iframeLoaded || heatmapData.length === 0) return;

    const heatmapContainer = document.getElementById("heatmap-container");
    if (!heatmapContainer) return;

    if (!heatmapInstance.current) {
      heatmapInstance.current = h337.create({
        container: heatmapContainer,
        radius: 30,
        maxOpacity: 0.6,
        blur: 0.8,
        gradient: { 0.2: "blue", 0.5: "yellow", 1.0: "red" },
      });
    }

    heatmapInstance.current.setData({
      max: Math.max(...heatmapData.map((point) => point.value), 10),
      data: heatmapData.map((point) => ({
        x: point.x,
        y: point.y - scrollY,
        value: point.value,
      })),
    });
  }, [iframeLoaded, heatmapData, scrollY]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (!projectUrl) return;

      const expectedOrigin = new URL(projectUrl).origin;
      if (event.origin !== expectedOrigin) return;

      const { type, scrollY, contentWidth } = event.data;
      if (type === "SCROLL_EVENT") {
        setScrollY(scrollY);
      }
      if (type === "CONTENT_WIDTH") {
        setIframeWidth(`${contentWidth}px`);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [projectUrl]);

  // Handle loading and expired token
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-t-4 border-b-4 border-purple-500 w-16 h-16 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (tokenExpired) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Session Expired</h2>
        <p className="mb-6">Your session has expired. Please log in again to continue.</p>
        <a
          href="/login"
          className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f3ff] min-h-screen text-gray-800">
      <Navbar2 />

      <div className="relative w-full h-screen">
        <div
          id="heatmap-container"
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
        ></div>

        <div
          id="heatmap-tooltip"
          className="absolute bg-tooltipBg text-white text-xs rounded px-2 py-1 pointer-events-none hidden z-20 animate-fadeIn"
          style={{ display: "none" }}
        ></div>

        <iframe
          ref={iframeRef}
          src={"http://127.0.0.1:5501/anon-ecommerce-website/index.html"}
          className="absolute top-0 left-0 z-0"
          style={{
            width: iframeWidth,
            height: "100%",
          }}
          onLoad={() => setIframeLoaded(true)}
          sandbox="allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
};

export default HeatmapPage;
