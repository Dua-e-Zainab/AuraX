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
import Dashboard from './components/Dashboard';
import NewPage from './components/NewPage';
import HeatmapPage from './components/Heatmap';
// import Navbar from './components/Navbar'; // Uncomment and import Navbar if needed
// import Footer from './components/Footer'; // Uncomment and import Footer if needed

const App = () => {
  return (
    // Wrap the entire application with GoogleOAuthProvider
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        {/* Navbar is included here so it appears on all pages */}
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
          <Route path="/newpage" element={<NewPage />} />
          <Route path="/heatmap" element={<HeatmapPage />} />
        </Routes>
        
        {/* Footer is included here so it appears on all pages */}
        {/* <Footer /> */}
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
