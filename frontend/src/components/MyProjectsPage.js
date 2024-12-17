import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaCog, FaUsers, FaSync } from 'react-icons/fa';
import Navbar1 from './Navbar1';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token'); // Get token from localStorage

            if (!token) {
                setErrorMessage('You must be logged in to view your projects.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/projects', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Attach the token here
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message || 'Failed to fetch projects');
                    throw new Error(errorData.message || 'Failed to fetch projects');
                }

                const data = await response.json();
                setProjects(data.projects);
            } catch (error) {
                console.error('Error fetching projects:', error);
                setErrorMessage('Something went wrong while fetching projects.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        // Confirm before deleting the project
        const isConfirmed = window.confirm('Are you sure you want to delete this project?');
        if (!isConfirmed) {
            return; // If the user cancels, do nothing
        }

        console.log(`Attempting to delete project with ID: ${projectId}`);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete project');
            }

            // Remove the deleted project from the state
            setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));

            // Show success popup
            alert('Project has been deleted successfully!');
            console.log('Project deleted successfully');
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Error deleting project: ' + error.message);
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
                        onClick={() => window.location.reload()}
                    >
                        <FaSync className="text-sm" />
                        <span>Refresh</span>
                    </button>
                </div>

                {loading ? (
                    <p>Loading projects...</p>
                ) : (
                    <>
                        {projects.length === 0 ? (
                            <p>No projects found. Start by creating a new project!</p>
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
                                                onClick={(e) => e.stopPropagation()} 
                                            >
                                                <FaCog />
                                                <span>Settings</span>
                                            </button>
                                            <button
                                                className="flex items-center space-x-2 hover:text-red-600"
                                                onClick={(e) => {
                                                    e.preventDefault(); 
                                                    e.stopPropagation(); 
                                                    handleDelete(project._id); 
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
                    </>
                )}
            </div>
        </div>
    );
};

export default MyProjects;
