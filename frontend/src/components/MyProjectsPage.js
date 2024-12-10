import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaCog, FaUsers, FaSync } from 'react-icons/fa';
import Navbar1 from './Navbar1';
import { useNavigate } from 'react-router-dom';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Retrieve userId and token from localStorage
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if the user is logged in
    if (!userId || !token) {
      console.error('No userId or token found. Please log in.');
      navigate('/login'); // Redirect to login if not logged in
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects', {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        console.log('Fetched projects:', data); // Debugging line
        setProjects(data.projects); // Assuming the response returns an object with `projects` key
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userId, token, navigate]); // Added token and navigate to dependency array

  const handleDelete = async (projectId) => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authorization
          },
        });

        if (response.ok) {
          setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
        } else {
          console.error('Error deleting project:', await response.json());
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

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
