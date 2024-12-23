import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // Import the LandingPage component
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProjectPage from './components/ProjectPage';
import CreateProjectPage from './components/CreateProjectPage';
import MyProjectsPage from './components/MyProjectsPage';
import OverviewPage from './components/OverviewPage';
import Dashboard from './components/Dashboard.js';
import HeatmapPage from './components/Heatmap.js';
import Insights_Page from './components/Insights_Page.js';
import CSS_Customiation from './components/CSS_Customization.js';
import CSS_Customization_Page from './components/CSS_Customization_Page.js';
//import Navbar from './components/Navbar'; // Import Navbar
//import Footer from './components/Footer'; // Import Footer

const App = () => {
  return (
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
        <Route path="/insights" element={<Insights_Page />} />
        <Route path="/css-customization" element={<CSS_Customiation />} />
        <Route path="/css-customization-page" element={<CSS_Customization_Page />} />
      </Routes>
      
      {/* Footer is included here so it appears on all pages */}
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
