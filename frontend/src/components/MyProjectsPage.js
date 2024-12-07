import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaCog, FaUsers, FaSync } from 'react-icons/fa';
import Navbar1 from './Navbar1';

const MyProjects = () => {
  const projects = [
    {
      id: 1,
      name: "Serendipity",
      url: "https://serendipitybyrooj.com/",
    },
    {
      id: 2,
      name: "Serendipity",
      url: "https://serendipitybyrooj.com/",
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-purple-100 to-blue-200">
      <Navbar1 />
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/createproject"
            className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded hover:from-blue-600 hover:to-purple-600 transition"
          >
            + New Project
          </Link>
          <button
            type="button"
            className="px-6 py-3 flex items-center space-x-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300 transition">
            <FaSync className="text-sm" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/overview/:id ${project.id}`}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4 transition hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-600">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {project.name}
                  </h2>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevent navigation on URL click
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {project.url}
                  </a>
                </div>
              </div>
              <div className="flex justify-between border-t pt-4 text-gray-600">
                <button
                  className="flex items-center space-x-2 hover:text-purple-600"
                  onClick={(e) => e.stopPropagation()} // Prevent navigation on button click
                >
                  <FaCog />
                  <span>Settings</span>
                </button>
                <button
                  className="flex items-center space-x-2 hover:text-red-600"
                  onClick={(e) => e.stopPropagation()} // Prevent navigation on button click
                >
                  <FaTrash />
                  <span>Delete</span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
