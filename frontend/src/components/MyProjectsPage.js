import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaUsers, FaSync, FaEdit } from 'react-icons/fa';
import Navbar1 from './Navbar1';
import ProjectPage from './ProjectPage';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('You must be logged in to view your projects.');
                setIsLoggedIn(false);
                setLoading(false);
                return;
            }

            setIsLoggedIn(true);

            try {
                const response = await fetch('http://localhost:5000/api/projects', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
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
        const isConfirmed = window.confirm('Are you sure you want to delete this project?');
        if (!isConfirmed) return;

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

            setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));
            alert('Project has been deleted successfully!');
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert('Error deleting project: ' + error.message);
        }
    };

    const handleEditClick = (project) => {
        setCurrentProject(project);
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/api/projects/${currentProject._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(currentProject),
            });

            if (response.ok) {
                setProjects((prevProjects) =>
                    prevProjects.map((project) =>
                        project._id === currentProject._id ? { ...currentProject } : project
                    )
                );
                setIsEditModalOpen(false);
            } else {
                const data = await response.json();
                console.error('Failed to update project:', data.message);
            }
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    const handleProjectClick = (projectId) => {
        // Save the selected projectId to localStorage
        localStorage.setItem("projectId", projectId);

        // Navigate to the project overview page
        navigate(`/overview/${projectId}`);
    };

    if (loading) {
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="border-t-4 border-b-4 border-purple-500 w-16 h-16 rounded-full animate-spin"></div>
          </div>
        );
      }

    if (!isLoggedIn) {
        return (
            <div className="h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex justify-center items-center">
                <p>{errorMessage || 'Please log in to view your projects.'}</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return <ProjectPage />;
    }

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
                                    className="flex items-center space-x-2 hover:text-green-600"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(project);
                                    }}
                                >
                                    <FaEdit />
                                    <span>Edit</span>
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
            </div>

            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white shadow-2xl rounded-lg p-8 w-96">
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
                            Edit Project
                        </h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentProject?.name || ''}
                                    onChange={handleInputChange}
                                    className="block w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Project URL
                                </label>
                                <input
                                    type="url"
                                    name="url"
                                    value={currentProject?.url || ''}
                                    onChange={handleInputChange}
                                    className="block w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Project Domain
                                </label>
                                <input
                                    type="text"
                                    name="domain"
                                    value={currentProject?.domain || ''}
                                    onChange={handleInputChange}
                                    className="block w-full border-2 border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyProjects;
