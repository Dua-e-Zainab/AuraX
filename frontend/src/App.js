import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';  // Import the Router and routing components
import { GoogleOAuthProvider } from '@react-oauth/google';  // Import Google OAuth Provider

// Import your page components
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProjectPage from './components/ProjectPage';
import CreateProjectPage from './components/CreateProjectPage';
import MyProjectsPage from './components/MyProjectsPage';
import OverviewPage from './components/OverviewPage';
import Dashboard from './components/Dashboard.js';
import HeatmapPage from './components/Heatmap.js';
import CSS_Customiation from './components/CSS_Customization.js';
import InsightsPage from './components/InsightsPage.js';
import HeatmapIntroPage from './components/heatmap_page.js';
import CSSCustomizationPage from './components/CSS_Customization_Page';
import InsightsIntroPage from './components/insights_page.js';


const App = () => {
  return (
    // Wrap the entire application with GoogleOAuthProvider
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        {/* Navbar can be added here if you wish */}
        {/* <Navbar /> */}

        <Routes>
          {/* Define all the routes for your pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/createproject" element={<CreateProjectPage />} />
          <Route path="/myprojects" element={<MyProjectsPage />} />
          <Route path="/overview/:id" element={<OverviewPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights"  element={<InsightsPage />}/>
          <Route path="/heatmap" element={<HeatmapPage />} />
          <Route path="/css-customization" element={<CSS_Customiation />} />
          <Route path="/heatmap-page" element={<HeatmapIntroPage />} />
          <Route path="/css-customization-page" element={<CSSCustomizationPage />} />
          <Route path="/insights-page" element={<InsightsIntroPage/>} />
        </Routes>
        
        {/* Footer and any global components can be added here */}
        {/* <Footer /> */}
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;