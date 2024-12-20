import React from 'react';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProjectPage from './components/ProjectPage';
import CreateProjectPage from './components/CreateProjectPage';
import MyProjectsPage from './components/MyProjectsPage';
import OverviewPage from './components/OverviewPage';
import Dashboard from './components/Dashboard.js';
import NewPage from './components/NewPage.js';
import HeatmapPage from './components/Heatmap.js';
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
        </Routes>
        
        {/* Footer is included here so it appears on all pages */}
        {/* <Footer /> */}
      </Router>
    </GoogleOAuthProvider>
  );
};



//     <Router>
//       {/* Navbar is included here so it appears on all pages */}
//       {/* <Navbar /> */}
      
//       <Routes>
//         {/* Root path will load the LandingPage */}
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/projects" element={<ProjectPage />} />
//         <Route path="/createproject" element={<CreateProjectPage />} />
//         <Route path="/myprojects" element={<MyProjectsPage />} />
//         <Route path="/overview/:id" element={<OverviewPage />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/NewPage" element={<NewPage />} />
//         <Route path="/heatmap" element={<HeatmapPage />} />
//       </Routes>

//       {/* Footer and any external links should be outside of the Routes */}
//       <Link to="/learn-react">Learn React</Link>
//       {/* <Footer /> */}
//     </Router>
//   );
// };

// export default App;

