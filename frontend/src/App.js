import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import h337 from "heatmap.js";

function App() {
    const heatmapRef = useRef(null);
    const heatmapInstance = useRef(null);
    const [totalClicks, setTotalClicks] = useState(0);
    const [rageClicks, setRageClicks] = useState(0);

    useEffect(() => {
        console.log("Initializing heatmap...");

        // Step 1: Create heatmap instance
        heatmapInstance.current = h337.create({
            container: heatmapRef.current,
            radius: 40,
            maxOpacity: 0.6,
            minOpacity: 0.2,
            blur: 0.75,
            gradient: {
                0: "blue",
                0.5: "yellow",
                1: "red",
            },
        });

        // Step 2: Force clear the heatmap
        if (heatmapInstance.current) {
            console.log("Clearing heatmap data...");
            heatmapInstance.current.setData({ max: 10, data: [] });
        } else {
            console.error("Heatmap instance is not initialized.");
        }

        //Step 3: Fetch backend data (optional, comment if not needed)
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/museclicks");
                console.log("Fetched data from backend:", response.data);

                // Skip loading data if the heatmap should be clear
                const points = response.data.map(({ x, y }) => ({ x, y, value: 1 }));
                heatmapInstance.current.setData({ max: 10, data: points });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        // // Comment out fetchData if persistent data is not required
        fetchData();

        const handleClick = async (event) => {
            // Step 4: Restrict clicks to image bounds
            const heatmapBounds = heatmapRef.current.getBoundingClientRect();
            const x = event.clientX - heatmapBounds.left;
            const y = event.clientY - heatmapBounds.top;

            if (x >= 0 && y >= 0 && x <= heatmapBounds.width && y <= heatmapBounds.height) {
                try {
                    console.log("Click registered at:", { x, y });
                    await axios.post("http://localhost:5001/api/museclicks", { x, y });
                    heatmapInstance.current.addData({ x, y, value: 1 });

                    setTotalClicks((prev) => prev + 1);

                    // Step 5: Detect rapid clicks for rage clicks
                    const nearbyPoints = heatmapInstance.current.getData().data.filter((point) => {
                        const distance = Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2));
                        return distance < 50 && point.value > 3;
                    });

                    if (nearbyPoints.length > 0) {
                        setRageClicks((prev) => prev + 1);
                    }
                } catch (error) {
                    console.error("Error saving click data:", error);
                }
            }
        };

        // Step 6: Add click event listener
        window.addEventListener("click", handleClick);

        return () => {
            // Cleanup event listeners
            window.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
            <h1 style={{ textAlign: "center" }}>Muse Clicks Heatmap Demo</h1>

            {/* Sidebar for Total and Rage Clicks */}
            <aside
                style={{
                    position: "absolute",
                    top: "60px",
                    left: "20px",
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    padding: "10px",
                    borderRadius: "8px",
                    zIndex: 2,
                }}
            >
                <h3>Click Stats</h3>
                <p>Total Clicks: {totalClicks}</p>
                <p>Rage Clicks: {rageClicks}</p>
            </aside>

            <main
                style={{
                    marginLeft: "220px",
                    padding: "20px",
                    boxSizing: "border-box",
                }}
            >
                {/* <h2>Main Content Area</h2>
                <p>This is the main content section where users may click on different items.</p>
                <button style={{ marginRight: "10px" }}>Button 1</button>
                <button style={{ marginRight: "10px" }}>Button 2</button>
                <button>Button 3</button> */}

                {/* Add image with heatmap */}
                <div
                    ref={heatmapRef}
                    style={{
                        position: "relative",
                        width: "1400px", // Adjusted width
                        height: "650px", // Adjusted height
                        marginTop: "20px",
                        backgroundImage: "url('website.jpeg')", // Replace with your image path
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "2px solid #333",
                        borderRadius: "8px",
                    }}
                ></div>
            </main>
        </div>
    );
}

export default App;