import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import GoogleOAuthProvider
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import required components from react-router-dom

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProjectPage from './components/ProjectPage';
import CreateProjectPage from './components/CreateProjectPage';
import MyProjectsPage from './components/MyProjectsPage';
import OverviewPage from './components/OverviewPage';
import Dashboard from './components/Dashboard.js';
import NewPage from './components/NewPage.js';
import HeatmapPage from './components/Heatmap.js';
import LandingPage from './components/LandingPage'; // Ensure LandingPage is imported

const App = () => {
  return (
    // Wrap the entire application with GoogleOAuthProvider
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <Router>
        {/* Navbar can be added here if you wish */}
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
        </Routes>

        {/* External links can be placed outside of Routes */}
        <Link to="/learn-react">Learn React</Link>
        
        {/* Footer and any global components can be added here */}
        {/* <Footer /> */}
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
