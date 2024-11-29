import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

function Report({ clickData }) {
    const [rageClicks, setRageClicks] = useState(0);
    const [coldZones, setColdZones] = useState(0);

    useEffect(() => {
        const clickCounts = {};
        clickData.forEach(({ x, y }) => {
            const key = `${x},${y}`;
            clickCounts[key] = (clickCounts[key] || 0) + 1;
        });

        const rageClickCount = Object.values(clickCounts).filter(count => count >= 3).length;
        setRageClicks(rageClickCount);

        const heatmapSize = 500; // Assuming a 500x500 layout
        const totalZones = heatmapSize * heatmapSize;
        const clickedZones = Object.keys(clickCounts).length;
        const coldZoneCount = totalZones - clickedZones;
        setColdZones(coldZoneCount);
    }, [clickData]);

    const rageClickData = {
        labels: ['Rage Clicks', 'Normal Clicks'],
        datasets: [
            {
                label: '# of Clicks',
                data: [rageClicks, clickData.length - rageClicks],
                backgroundColor: ['#ff6384', '#36a2eb'],
            },
        ],
    };

    const coldZoneData = {
        labels: ['Cold Zones', 'Clicked Zones'],
        datasets: [
            {
                label: '# of Zones',
                data: [coldZones, clickData.length],
                backgroundColor: ['#9966ff', '#4bc0c0'],
            },
        ],
    };

    return (
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h2>Interaction Report</h2>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '50%' }}>
                    <h3>Rage Click Analysis</h3>
                    <Bar data={rageClickData} options={{ responsive: true }} />
                </div>

                <div style={{ width: '50%' }}>
                    <h3>Cold Zone Analysis</h3>
                    <Pie data={coldZoneData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
}

export default Report;
