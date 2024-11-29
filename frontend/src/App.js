import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import h337 from 'heatmap.js';

function App() {
    const heatmapRef = useRef(null);
    const heatmapInstance = useRef(null);
    const [hoverInfo, setHoverInfo] = useState(null);

    useEffect(() => {
        heatmapInstance.current = h337.create({
            container: heatmapRef.current,
            radius: 40,
            maxOpacity: 0.6,
            minOpacity: 0.2,
            blur: 0.75,
            gradient: {
                0: 'blue',
                0.5: 'yellow',
                1: 'red'
            }
        });

        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/museclicks');
                const clickData = {};

                response.data.forEach(({ x, y }) => {
                    const key = `${x},${y}`;
                    clickData[key] = (clickData[key] || 0) + 1;
                });

                const points = Object.entries(clickData).map(([key, count]) => {
                    const [x, y] = key.split(',').map(Number);
                    return { x, y, value: count };
                });

                heatmapInstance.current.setData({ max: 10, data: points });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const handleClick = async (event) => {
            const x = event.clientX;
            const y = event.clientY;
            try {
                await axios.post('http://localhost:5000/api/museclicks', { x, y });
                heatmapInstance.current.addData({ x, y, value: 1 });
            } catch (error) {
                console.error('Error saving coordinates:', error);
            }
        };

        const handleMouseMove = (event) => {
            const { clientX: x, clientY: y } = event;
            const clickData = heatmapInstance.current.getValueAt({ x, y });
            if (clickData) {
                setHoverInfo({ x, y, count: clickData });
            } else {
                setHoverInfo(null);
            }
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <h1 style={{ textAlign: 'center' }}>Muse Clicks Heatmap Demo</h1>

            {/* Hover Information for Click Counts */}
            {hoverInfo && (
                <div
                    style={{
                        position: 'absolute',
                        top: hoverInfo.y,
                        left: hoverInfo.x,
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '5px',
                        borderRadius: '5px',
                        pointerEvents: 'none',
                    }}
                >
                    Clicks: {hoverInfo.count}
                </div>
            )}

            {/* Background Layout */}
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <header
                    style={{
                        background: '#333',
                        color: '#fff',
                        padding: '10px',
                        textAlign: 'center',
                        fontSize: '24px',
                    }}
                >
                    Website Header
                </header>

                <aside
                    style={{
                        position: 'absolute',
                        top: '60px',
                        left: '0',
                        width: '200px',
                        height: 'calc(100% - 60px)',
                        backgroundColor: '#f4f4f4',
                        padding: '20px',
                        boxSizing: 'border-box',
                    }}
                >
                    <h3>Sidebar</h3>
                    <button style={{ marginBottom: '10px' }}>Sidebar Button 1</button>
                    <button style={{ marginBottom: '10px' }}>Sidebar Button 2</button>
                </aside>

                <main
                    style={{
                        marginLeft: '220px',
                        padding: '20px',
                        boxSizing: 'border-box',
                    }}
                >
                    <h2>Main Content Area</h2>
                    <p>This is the main content section where users may click on different items.</p>
                    <button style={{ marginRight: '10px' }}>Button 1</button>
                    <button style={{ marginRight: '10px' }}>Button 2</button>
                    <button>Button 3</button>
                </main>
            </div>

            {/* Heatmap Overlay */}
            <div
                ref={heatmapRef}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            ></div>
        </div>
    );
}

export default App;
