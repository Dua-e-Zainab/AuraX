import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBriefcase,
  faHome,
  faFire,
  faPalette,
  faChartBar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar2 = () => {
  return (
    <nav className="bg-white shadow-sm py-8 flex items-center h-100 w-full">
      <ul className="flex justify-center space-x-20 text-gray-400 text-lg font-medium w-full mx-auto">
        {/* Overview */}
        <li>
          <NavLink
            to="/overview/:id"
            className={({ isActive }) =>
              isActive ? "text-purple-600 flex items-center" : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faBriefcase} className="text-2xl mr-2" />
            Overview
          </NavLink>

        </li>

        {/* Dashboard */}
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faHome} className="text-2xl mr-2" />
            Dashboard
          </NavLink>
        </li>

        {/* Heatmaps */}
        <li>
          <NavLink
            to="/heatmap"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faFire} className="text-2xl mr-2" />
            Heatmaps
          </NavLink>
        </li>

        {/* CSS Customization */}
        <li>
          <NavLink
            to="/css-customization"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faPalette} className="text-2xl mr-2" />
            CSS Customization
          </NavLink>
        </li>

        {/* Insights */}
        <li>
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faChartBar} className="text-2xl mr-2" />
            Insights
          </NavLink>
        </li>

        {/* Profile */}
        <li>
          <NavLink
            to="/myprojects"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 flex items-center"
                : "hover:text-purple-600 flex items-center"
            }
          >
            <FontAwesomeIcon icon={faUser} className="text-2xl mr-2" />
            Account
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar2;
