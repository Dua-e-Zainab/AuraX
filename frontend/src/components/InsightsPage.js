import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar2 from "./Navbar2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Info, AlertTriangle, Mouse, Eye, Download, BarChart3, TrendingUp, FileText } from "lucide-react";

// Real API function to fetch metrics data
const fetchMetricsData = async (projectId, startDate, endDate) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const response = await fetch(
      `https://aura-x.up.railway.app/api/track/dashboard/${projectId}?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch metrics data');
    }

    // Extract metrics from API response
    const sessionCount = data.metrics.find(m => m.title === "Sessions")?.value || 0;
    const totalClicks = data.metrics.find(m => m.title === "Total Clicks")?.value || 0;
    
    // Parse insight percentages back to numbers
    const rageClicksPercent = parseFloat(data.insights.find(i => i.label === "Rage Clicks")?.value.replace('%', '') || 0);
    const deadClicksPercent = parseFloat(data.insights.find(i => i.label === "Dead Clicks")?.value.replace('%', '') || 0);
    const quickClicksPercent = parseFloat(data.insights.find(i => i.label === "Quick Clicks")?.value.replace('%', '') || 0);
    
    // Calculate actual numbers from percentages
    const rageClicks = Math.round((rageClicksPercent / 100) * totalClicks);
    const deadClicks = Math.round((deadClicksPercent / 100) * totalClicks);
    const quickClicks = Math.round((quickClicksPercent / 100) * totalClicks);

    return {
      totalClicks,
      rageClicks,
      deadClicks,
      quickClicks,
      totalPageViews: sessionCount, // Using sessions as page views for now
      sessionCount,
      distributions: data.distributions || {},
      pageData: data.pageData || []
    };
  } catch (error) {
    console.error("Error fetching metrics data:", error);
    throw error;
  }
};

// Fetch heatmap summary data (same as before but with error handling improvements)
const fetchHeatmapSummary = async (projectId, startDate, endDate) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token");

    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    const response = await fetch(
      `https://aura-x.up.railway.app/api/track/heatmap/${projectId}?${params}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch heatmap data');
    }
    
    // Process heatmap data to generate summary
    const heatmapData = data.data || [];
    
    // Find top click zones by grouping coordinates
    const clickZones = {};
    const rageClickAreas = {};
    const deadZones = {};
    
    heatmapData.forEach(point => {
      const zone = `${Math.floor(point.x / 100)}-${Math.floor(point.y / 100)}`;
      clickZones[zone] = (clickZones[zone] || 0) + (point.intensity || 1);
      
      // Simulate rage click detection (high intensity areas)
      if ((point.intensity || 1) > 8) {
        rageClickAreas[zone] = (rageClickAreas[zone] || 0) + 1;
      }
      
      // Simulate dead click detection (low intensity isolated clicks)
      if ((point.intensity || 1) < 3) {
        deadZones[zone] = (deadZones[zone] || 0) + 1;
      }
    });
    
    // Get top click zone
    const topZone = Object.entries(clickZones).sort(([,a], [,b]) => b - a)[0];
    const topClickZone = topZone ? {
      zone: topZone[0],
      percentage: Math.round((topZone[1] / Math.max(heatmapData.length, 1)) * 100)
    } : { zone: "No data", percentage: 0 };
    
    // Get rage click areas
    const topRageAreas = Object.entries(rageClickAreas)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([zone]) => zone);
    
    // Get dead zones
    const topDeadZones = Object.entries(deadZones)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 1)
      .map(([zone]) => zone);

    return {
      totalDataPoints: heatmapData.length,
      topClickZone,
      rageClickAreas: topRageAreas.length > 0 ? topRageAreas : [],
      deadZones: topDeadZones.length > 0 ? topDeadZones : [],
      hasData: heatmapData.length > 0,
      dateRange: data.stats?.dateRange || { from: startDate.toISOString(), to: endDate.toISOString() }
    };
  } catch (error) {
    console.error("Error fetching heatmap summary:", error);
    // Return empty data structure instead of mock data
    return {
      totalDataPoints: 0,
      topClickZone: { zone: "No data", percentage: 0 },
      rageClickAreas: [],
      deadZones: [],
      hasData: false,
      dateRange: { from: startDate.toISOString(), to: endDate.toISOString() }
    };
  }
};

// Animated Metric Card Component
const AnimatedMetricCard = ({ icon: Icon, value, label, color, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = parseInt(value.toString().replace(/,/g, ''));
      const duration = 1500;
      const increment = end / (duration / 50);
      
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 50);
      
      return () => clearInterval(counter);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div className={`text-center p-6 bg-gradient-to-br ${color} rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-xl animate-fade-in-up group`}>
      <Icon className="w-10 h-10 mx-auto mb-3 text-white group-hover:scale-110 transition-transform duration-300" />
      <p className="text-3xl font-bold text-white mb-1">
        {displayValue.toLocaleString()}
      </p>
      <p className="text-sm text-white/90 font-medium">{label}</p>
      <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white/40 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

const InsightsPage = () => {
  const navigate = useNavigate();
  const { projectId: paramProjectId } = useParams();
  const projectId = paramProjectId || localStorage.getItem("projectId");
  
  const [metrics, setMetrics] = useState(null);
  const [heatmapSummary, setHeatmapSummary] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Ref for the entire insights content for PDF generation
  const insightsContentRef = useRef(null);

  const fetchMetrics = async () => {
    if (!projectId) {
      setError("No project ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [metricsData, heatmapData] = await Promise.all([
        fetchMetricsData(projectId, startDate, endDate),
        fetchHeatmapSummary(projectId, startDate, endDate)
      ]);
      
      setMetrics(metricsData);
      setHeatmapSummary(heatmapData);
    } catch (err) {
      console.error("Error fetching insights:", err);
      setError(err.message || 'Failed to load insights data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchMetrics, 300);
    return () => clearTimeout(timeoutId);
  }, [projectId, startDate, endDate]);

  const getAlerts = () => {
    if (!metrics) return [];
    const { rageClicks, quickClicks, deadClicks, totalClicks } = metrics;
    const alertMessages = [];

    // Calculate thresholds based on total clicks
    const rageThreshold = Math.max(20, Math.floor(totalClicks * 0.05)); // 5% of total clicks or minimum 20
    const quickThreshold = Math.max(30, Math.floor(totalClicks * 0.10)); // 10% of total clicks or minimum 30
    const deadThreshold = Math.max(25, Math.floor(totalClicks * 0.08)); // 8% of total clicks or minimum 25

    if (rageClicks > rageThreshold)
      alertMessages.push({
        type: "warning",
        message: `High rage clicks detected (${rageClicks}). Users may be frustrated with UI elements.`,
        icon: "🔥"
      });

    if (quickClicks > quickThreshold)
      alertMessages.push({
        type: "info",
        message: `Multiple quick clicks detected (${quickClicks}). Consider improving button responsiveness.`,
        icon: "⚡"
      });

    if (deadClicks > deadThreshold)
      alertMessages.push({
        type: "warning",
        message: `Dead clicks detected (${deadClicks}). Users are clicking non-interactive elements.`,
        icon: "❌"
      });

    return alertMessages;
  };

  const getEngagementLevels = () => {
    if (!metrics || !metrics.distributions) {
      return [
        { label: "High Activity", percentage: 0, color: "bg-red-500" },
        { label: "Moderate Activity", percentage: 0, color: "bg-purple-500" },
        { label: "Low Activity", percentage: 0, color: "bg-orange-400" },
        { label: "No Activity", percentage: 0, color: "bg-gray-400" }
      ];
    }

    const { sessionCount, totalClicks } = metrics;
    
    // Calculate engagement based on clicks per session
    const clicksPerSession = sessionCount > 0 ? totalClicks / sessionCount : 0;
    
    // Define engagement levels based on clicks per session
    let highActivity = 0, moderateActivity = 0, lowActivity = 0, noActivity = 0;
    
    if (clicksPerSession > 10) {
      highActivity = 85;
      moderateActivity = 60;
      lowActivity = 35;
      noActivity = 5;
    } else if (clicksPerSession > 5) {
      highActivity = 65;
      moderateActivity = 80;
      lowActivity = 45;
      noActivity = 10;
    } else if (clicksPerSession > 1) {
      highActivity = 35;
      moderateActivity = 55;
      lowActivity = 70;
      noActivity = 15;
    } else {
      highActivity = 15;
      moderateActivity = 25;
      lowActivity = 40;
      noActivity = 80;
    }

    return [
      { label: "High Activity", percentage: highActivity, color: "bg-red-500" },
      { label: "Moderate Activity", percentage: moderateActivity, color: "bg-purple-500" },
      { label: "Low Activity", percentage: lowActivity, color: "bg-orange-400" },
      { label: "No Activity", percentage: noActivity, color: "bg-gray-400" }
    ];
  };

  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value));
  };

  // Fixed navigation to heatmap page
  const handleViewFullHeatmap = () => {
    if (!projectId) {
      alert('Project ID is required to view heatmap');
      return;
    }
    
    // Navigate to heatmap page - FIXED URL
    navigate(`/heatmap`, {
      state: {
        projectId: projectId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  };

  // New Generate Report functionality
  const handleGenerateReport = async () => {
    if (!metrics || !heatmapSummary) {
      alert('No data available to generate report');
      return;
    }

    setIsExporting(true);
    try {
      // Create a comprehensive report object
      const reportData = {
        projectId,
        dateRange: {
          start: startDate.toLocaleDateString(),
          end: endDate.toLocaleDateString()
        },
        metrics: {
          sessions: metrics.sessionCount,
          totalClicks: metrics.totalClicks,
          rageClicks: metrics.rageClicks,
          deadClicks: metrics.deadClicks,
          quickClicks: metrics.quickClicks,
          avgClicksPerSession: metrics.sessionCount > 0 ? (metrics.totalClicks / metrics.sessionCount).toFixed(1) : 0
        },
        heatmapSummary: {
          totalDataPoints: heatmapSummary.totalDataPoints,
          topClickZone: heatmapSummary.topClickZone,
          rageClickAreas: heatmapSummary.rageClickAreas,
          deadZones: heatmapSummary.deadZones
        },
        alerts: getAlerts(),
        engagementLevels: getEngagementLevels(),
        generatedAt: new Date().toISOString()
      };

      // Create and download JSON report
      const reportJson = JSON.stringify(reportData, null, 2);
      const blob = new Blob([reportJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `analytics-report-${projectId}-${new Date().toISOString().split('T')[0]}.json`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      // Show success message
      alert('Report generated successfully! You can share this JSON file with stakeholders or import it for comparison.');
      
    } catch (error) {
      console.error('Report generation error:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // New PDF export functionality with full insights
  const handleExportPDF = async () => {
    if (!metrics || !heatmapSummary) {
      alert('No data available to export');
      return;
    }

    setIsExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Analytics Insights Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Date range
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Report Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Overview Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Overview', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const overviewData = [
        `Total Sessions: ${metrics.sessionCount.toLocaleString()}`,
        `Total Clicks: ${metrics.totalClicks.toLocaleString()}`,
        `Rage Clicks: ${metrics.rageClicks.toLocaleString()}`,
        `Dead Clicks: ${metrics.deadClicks.toLocaleString()}`,
        `Quick Clicks: ${metrics.quickClicks.toLocaleString()}`,
        `Average Clicks per Session: ${metrics.sessionCount > 0 ? (metrics.totalClicks / metrics.sessionCount).toFixed(1) : 0}`
      ];

      overviewData.forEach(item => {
        pdf.text(item, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 10;

      // Engagement Levels Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('User Engagement Levels', 20, yPosition);
      yPosition += 10;

      const engagementLevels = getEngagementLevels();
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      engagementLevels.forEach(level => {
        pdf.text(`${level.label}: ${level.percentage}%`, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 10;

      // Heatmap Summary Section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Heatmap Summary', 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const heatmapData = [
        `Total Data Points: ${heatmapSummary.totalDataPoints}`,
        `Top Click Zone: ${heatmapSummary.topClickZone.zone.replace(/-/g, ' ')} (${heatmapSummary.topClickZone.percentage}%)`,
        `Rage Click Areas: ${heatmapSummary.rageClickAreas.length > 0 ? heatmapSummary.rageClickAreas.join(', ') : 'None detected'}`,
        `Dead Zones: ${heatmapSummary.deadZones.length > 0 ? heatmapSummary.deadZones.join(', ') : 'None detected'}`
      ];

      heatmapData.forEach(item => {
        pdf.text(item, 25, yPosition);
        yPosition += 7;
      });
      yPosition += 10;

      // Alerts Section
      const alerts = getAlerts();
      if (alerts.length > 0) {
        // Check if we need a new page
        if (yPosition > pageHeight - 50) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Alerts & Recommendations', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        alerts.forEach((alert, index) => {
          const text = `${index + 1}. ${alert.message}`;
          const splitText = pdf.splitTextToSize(text, pageWidth - 50);
          pdf.text(splitText, 25, yPosition);
          yPosition += splitText.length * 7 + 5;
        });
      }

      // Add footer
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

      // Save the PDF
      pdf.save(`insights-report-${projectId}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCompareHeatmap = () => {
    // Navigate to comparison view or show modal
    alert('Comparison feature would allow you to compare current heatmap with previous time periods.');
  };

  const alerts = getAlerts();
  const engagementLevels = getEngagementLevels();

  // Custom styles for animations
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideInLeft {
      from { transform: translateX(-30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideInRight {
      from { transform: translateX(30px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    .animate-slide-up { animation: slideUp 0.8s ease-out; }
    .animate-slide-in-left { animation: slideInLeft 0.8s ease-out; }
    .animate-slide-in-right { animation: slideInRight 0.8s ease-out; }
    .animate-fade-in-up { animation: slideUp 0.6s ease-out; }
    .animate-gradient { 
      background-size: 200% 200%; 
      animation: gradientShift 3s ease infinite; 
    }
  `;

  // Loading Component with animations
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 absolute top-2 left-2 animate-pulse"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading insights...</p>
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
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      <header className="animate-fade-in">
        <Navbar2 />
      </header>
        <div className="py-8 px-4 sm:px-6 md:px-12 lg:px-20 animate-slide-up" ref={insightsContentRef}>
          <div className="flex items-center justify-between gap-4 flex-wrap mb-8 transform transition-all duration-700 animate-fade-in-up">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text leading-relaxed pb-2 animate-gradient">
                Analytics Insights
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-4 max-w-3xl leading-relaxed">
                Track user behavior and identify UX issues with beautiful animated visualizations
              </p>
            </div>
          <div className="flex gap-3 items-end animate-slide-in-right">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={handleStartDateChange}
                max={endDate.toISOString().split('T')[0]}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={handleEndDateChange}
                min={startDate.toISOString().split('T')[0]}
                max={new Date().toISOString().split('T')[0]}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 focus:ring-2 focus:ring-purple-300 focus:border-purple-400"
              />
            </div>
            {/* PDF Export Button */}
            <button
              onClick={handleExportPDF}
              disabled={isExporting || !metrics}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">Error Loading Insights</h3>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                <button 
                  onClick={fetchMetrics} 
                  className="mt-2 text-sm text-red-700 underline hover:text-red-800 transition-colors duration-200"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {metrics && heatmapSummary ? (
          <div className="flex flex-col md:flex-row gap-6 animate-fade-in-up">
            {/* LEFT: Heatmap Summary */}
            <div className="w-full md:w-1/3 animate-slide-in-left">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] group">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  🔥 Heatmap Summary
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full animate-pulse">
                    {heatmapSummary.totalDataPoints} points
                  </span>
                </h3>

                                <div 
                  className="heatmap-preview bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 rounded-xl p-4 overflow-hidden mb-6 cursor-pointer hover:from-purple-200 hover:via-pink-200 hover:to-blue-200 transition-all duration-500 transform hover:scale-105 group border-2 border-transparent hover:border-purple-300" 
                  onClick={handleViewFullHeatmap}
                >
                  <div className="w-full h-36 bg-gradient-to-br from-purple-400 via-red-400 to-yellow-300 rounded-lg flex items-center justify-center text-white text-sm font-semibold relative overflow-hidden shadow-lg">
                    {heatmapSummary.hasData ? (
                      <>
                        {/* Animated heat points */}
                        <div className="absolute top-3 left-3 w-5 h-5 bg-red-500 rounded-full opacity-90 animate-pulse shadow-lg"></div>
                        <div className="absolute top-8 right-6 w-4 h-4 bg-yellow-400 rounded-full opacity-70 animate-pulse shadow-md" style={{animationDelay: '0.3s'}}></div>
                        <div className="absolute bottom-6 left-8 w-6 h-6 bg-red-600 rounded-full opacity-95 animate-pulse shadow-lg" style={{animationDelay: '0.6s'}}></div>
                        <div className="absolute bottom-3 right-3 w-3 h-3 bg-orange-400 rounded-full opacity-80 animate-pulse shadow-md" style={{animationDelay: '0.9s'}}></div>
                        <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-pink-500 rounded-full opacity-75 animate-pulse shadow-md" style={{animationDelay: '1.2s'}}></div>
                        
                        {/* Ripple effect on hover */}
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
                        
                        <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                          <Eye className="w-4 h-4 inline mr-2" />
                          Heatmap Preview
                        </div>
                      </>
                    ) : (
                      <div className="bg-black bg-opacity-50 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
                        <AlertTriangle className="w-4 h-4 inline mr-2" />
                        No Data Available
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-3 text-center group-hover:text-purple-600 transition-colors duration-300 font-medium">
                    🔥 Click to explore interactive heatmap
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700">🎯 Top Click Zone</span>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-purple-600 font-bold text-lg">
                          {heatmapSummary.topClickZone.percentage}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 bg-white/60 px-3 py-1 rounded-full inline-block">
                      📍 {heatmapSummary.topClickZone.zone.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-100">
                    <p className="text-sm font-semibold text-gray-700 mb-2">🔥 Rage Click Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {heatmapSummary.rageClickAreas.length > 0 ? 
                        heatmapSummary.rageClickAreas.map((area, idx) => (
                          <span key={idx} className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium border border-red-200 hover:bg-red-200 transition-colors duration-200 cursor-pointer">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {area.replace(/-/g, ' ')}
                          </span>
                        )) : 
                        <span className="text-gray-500 text-xs bg-gray-100 px-3 py-1 rounded-full">✅ None detected</span>
                      }
                    </div>
                  </div>

                  {heatmapSummary.deadZones.length > 0 && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">❌ Dead Zones</p>
                      <div className="flex flex-wrap gap-2">
                        {heatmapSummary.deadZones.map((zone, idx) => (
                          <span key={idx} className="inline-flex items-center bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-300">
                            <Mouse className="w-3 h-3 mr-1" />
                            {zone.replace(/-/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={handleViewFullHeatmap}
                    disabled={!projectId}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium group"
                  >
                    <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>View Interactive Heatmap</span>
                    <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
                  </button>
                  
                  <button 
                    onClick={handleGenerateReport}
                    disabled={isExporting || !metrics}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium group"
                  >
                    <Download className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>{isExporting ? 'Generating...' : 'Generate Report'}</span>
                    {isExporting && <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>}
                  </button>
                  
                  <button 
                    onClick={handleCompareHeatmap}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium group"
                  >
                    <BarChart3 className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Compare Analytics</span>
                    <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </div>

                {heatmapSummary.hasData && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">📊 Data Points:</span>
                          <span className="font-mono text-blue-600 font-bold">
                            {heatmapSummary.totalDataPoints.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">📅 Date Range:</span>
                          <span className="font-mono text-xs">
                            {new Date(heatmapSummary.dateRange.from).toLocaleDateString()} → {new Date(heatmapSummary.dateRange.to).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Overview, Engagement, Alerts */}
            <div className="w-full md:w-2/3 space-y-6 animate-slide-in-right">
              {/* Animated Metrics Overview */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                    📊 Performance Overview
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live Data
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <AnimatedMetricCard
                    icon={Eye}
                    value={metrics.sessionCount}
                    label="Sessions"
                    color="from-blue-500 to-blue-600"
                    delay={0}
                  />
                  <AnimatedMetricCard
                    icon={Mouse}
                    value={metrics.totalClicks}
                    label="Total Clicks"
                    color="from-green-500 to-green-600"
                    delay={200}
                  />
                  <AnimatedMetricCard
                    icon={AlertTriangle}
                    value={metrics.rageClicks}
                    label="Rage Clicks"
                    color={metrics.rageClicks > Math.max(20, Math.floor(metrics.totalClicks * 0.05)) ? "from-red-500 to-red-600" : "from-gray-500 to-gray-600"}
                    delay={400}
                  />
                  <AnimatedMetricCard
                    icon={Mouse}
                    value={metrics.deadClicks}
                    label="Dead Clicks"
                    color={metrics.deadClicks > Math.max(25, Math.floor(metrics.totalClicks * 0.08)) ? "from-orange-500 to-orange-600" : "from-gray-500 to-gray-600"}
                    delay={600}
                  />
                </div>

                {/* Additional Metrics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xl font-bold text-purple-600">
                      {metrics.sessionCount > 0 ? (metrics.totalClicks / metrics.sessionCount).toFixed(1) : '0'}
                    </p>
                    <p className="text-xs text-gray-600">Avg Clicks/Session</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <BarChart3 className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xl font-bold text-emerald-600">
                      {metrics.totalClicks > 0 ? ((metrics.totalClicks - metrics.rageClicks - metrics.deadClicks) / metrics.totalClicks * 100).toFixed(1) : '0'}%
                    </p>
                    <p className="text-xs text-gray-600">Healthy Clicks</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 lg:col-span-1 col-span-2">
                    <Info className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <p className="text-xl font-bold text-amber-600">{metrics.quickClicks}</p>
                    <p className="text-xs text-gray-600">Quick Clicks</p>
                  </div>
                </div>
              </div>

              {/* Animated Engagement Levels */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
                    🎯 User Engagement Distribution
                  </h3>
                  <div className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                    Real-time Analytics
                  </div>
                </div>
                
                <div className="space-y-5">
                  {engagementLevels.map((level, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${level.color} animate-pulse`}></div>
                          {level.label}
                        </span>
                        <span className="text-sm font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded-full">
                          {level.percentage}%
                        </span>
                      </div>
                      <div className="relative bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div 
                          className={`${level.color} h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden group-hover:shadow-lg`} 
                          style={{ 
                            width: `${level.percentage}%`,
                            animationDelay: `${index * 200}ms`
                          }}
                        >
                          {/* Animated shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                        {/* Progress indicator */}
                        <div 
                          className="absolute top-0 w-1 h-full bg-white/50 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            left: `${level.percentage}%`,
                            animationDelay: `${index * 200}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100">
                      <p className="text-xs text-gray-600 mb-1">Total Interactions</p>
                      <p className="text-lg font-bold text-blue-600">
                        {metrics.totalClicks.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100">
                      <p className="text-xs text-gray-600 mb-1">Active Sessions</p>
                      <p className="text-lg font-bold text-purple-600">
                        {metrics.sessionCount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    💡 Engagement calculated from {metrics.sessionCount > 0 ? (metrics.totalClicks / metrics.sessionCount).toFixed(1) : 0} avg interactions per session
                  </p>
                </div>
              </div>

              {/* Enhanced Alerts Section */}
              {alerts.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative">
                      <AlertTriangle className="w-7 h-7 text-amber-600 animate-pulse" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-amber-800">🚨 Critical Insights</h4>
                      <p className="text-sm text-amber-700">Issues detected that need immediate attention</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {alerts.map((alert, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-l-4 border-amber-400 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] group">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{alert.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                                alert.type === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {alert.type}
                              </span>
                              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-800 font-medium">
                              {alert.message}
                            </p>
                            
                            {/* Action suggestions */}
                            <div className="mt-3 flex gap-2">
                              <button className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-full transition-colors duration-200 font-medium">
                                📋 View Details
                              </button>
                              <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full transition-colors duration-200 font-medium">
                                🔧 Quick Fix
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-amber-200">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-700 font-medium">
                        💡 {alerts.length} issue{alerts.length > 1 ? 's' : ''} detected • Immediate action recommended
                      </p>
                      <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        📊 Generate Fix Report
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Success State when no alerts */}
              {alerts.length === 0 && (
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-3xl animate-bounce">✅</div>
                    </div>
                    <h4 className="text-xl font-bold text-green-800 mb-2">All Systems Healthy!</h4>
                    <p className="text-green-700 text-sm">
                      No critical issues detected. Your user experience is performing well.
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20 animate-fade-in">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 max-w-md mx-auto border border-white/20">
                <div className="relative mb-6">
                  <Eye className="w-20 h-20 text-gray-400 mx-auto animate-pulse" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Data Available</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  No insights data found for the selected date range. 
                  Try adjusting your date filters or check back later.
                </p>
                {!projectId && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-red-700 text-sm font-medium">
                      ⚠️ Project ID missing. Please ensure a valid project is selected.
                    </p>
                  </div>
                )}
                <button 
                  onClick={fetchMetrics}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🔄 Retry Loading
                </button>
              </div>
            </div>
          )
        )}

        {/* Action Bar at bottom */}
        {metrics && heatmapSummary && (
          <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h4 className="font-bold text-gray-800 mb-1">📈 Export & Share Analytics</h4>
                <p className="text-sm text-gray-600">
                  Generate comprehensive reports for stakeholders and team analysis
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <FileText className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
                <button
                  onClick={handleGenerateReport}
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <Download className="w-4 h-4" />
                  {isExporting ? 'Generating...' : 'JSON Report'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPage;