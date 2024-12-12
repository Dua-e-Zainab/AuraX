import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaCog, FaUsers, FaSync } from 'react-icons/fa';
import Navbar1 from './Navbar1';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects'); // Fetch projects from the server

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                setProjects(data.projects); // Assuming the response has a `projects` key
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []); // Runs once on component mount

    const handleDelete = async (projectId) => {
        if (!projectId) {
            console.error('No project ID provided');
            return;
        }

        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setProjects((prevProjects) =>
                        prevProjects.filter((project) => project._id !== projectId)
                    );
                } else {
                    console.error('Failed to delete project');
                }
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleProjectClick = (projectId) => {
        navigate(`/overview/${projectId}`);
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
                        className="px-6 py-3 flex items-center space-x-1 bg-gray-200 text-gray-800 rounded shadow hover:bg-gray-300 transition"
                        onClick={() => window.location.reload()} // Reload the page to refresh projects
                    >
                        <FaSync className="text-sm" />
                        <span>Refresh</span>
                    </button>
                </div>

                {loading ? (
                    <p>Loading projects...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project._id}
                                className="bg-white shadow-lg rounded-lg p-6 flex flex-col space-y-4 transition hover:shadow-xl cursor-pointer"
                                onClick={() => handleProjectClick(project._id)}
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
                                            className="text-sm text-blue-500 hover:underline"
                                        >
                                            {project.url}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex justify-between border-t pt-4 text-gray-600">
                                    <button
                                        className="flex items-center space-x-2 hover:text-purple-600"
                                        onClick={(e) => e.stopPropagation()} // Prevent navigation
                                    >
                                        <FaCog />
                                        <span>Settings</span>
                                    </button>
                                    <button
                                        className="flex items-center space-x-2 hover:text-red-600"
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent navigation
                                            e.stopPropagation(); // Prevent propagation to parent `Link`
                                            handleDelete(project._id); // Pass _id to handleDelete
                                        }}
                                    >
                                        <FaTrash />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProjects;
