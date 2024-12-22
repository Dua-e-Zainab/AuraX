import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Import the Router and routing components
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
import InsightsPage from './components/InsightsPage.js';
import CSSCustomiation from './components/CSS-Customization.js';
import CSSCustomizationPage from './components/CSSCustomizationPage.js';
//import Navbar from './components/Navbar'; // Import Navbar
//import Footer from './components/Footer'; // Import Footer

const App = () => {
  return (
    // Wrap the entire application with GoogleOAuthProvider
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
    <Router>
      {/* Navbar is included here so it appears on all pages */}
      {/* <Navbar /> */}
      
      <Routes>
        {/* Root path will load the LandingPage */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route path="/createproject" element={<CreateProjectPage />} />
        <Route path="/myprojects" element={<MyProjectsPage />} />
        <Route path="/overview/:id" element={<OverviewPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/heatmap" element={<HeatmapPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/css-customization" element={<CSSCustomiation />} />
        <Route path="/css-customization-page" element={<CSSCustomizationPage />} />
      </Routes>

      {/* External links can be placed outside of Routes */}
      <Link to="/learn-react">Learn React</Link>
      
      {/* Footer is included here so it appears on all pages */}
      {/* <Footer /> */}
    </Router>
    </GoogleOAuthProvider>
  )
}
export default App;


