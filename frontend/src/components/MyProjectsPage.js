import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaUsers, FaSync, FaEdit, FaTh, FaList, FaExclamationTriangle} from 'react-icons/fa';
import { X, Flame, Palette, BarChart3} from 'lucide-react';
import Navbar1 from './Navbar1';
import ProjectPage from './ProjectPage';
import { FaQuestionCircle as HelpCircle } from 'react-icons/fa';

const MyProjects = () => {
    const [projects, setProjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [refreshing, setRefreshing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setErrorMessage('You must be logged in to view your projects.');
                setIsLoggedIn(false);
                setIsLoading(false);
                return;
            }

            setIsLoggedIn(true);

            try {
                const response = await fetch('https://aura-x.up.railway.app/api/projects', {
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
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!projectToDelete) return;

        setDeleting(true);
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`https://aura-x.up.railway.app/api/projects/${projectToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete project');
            }

            setProjects(prevProjects => prevProjects.filter(project => project._id !== projectToDelete._id));
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
            
            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
            successDiv.innerHTML = '✓ Project deleted successfully!';
            document.body.appendChild(successDiv);
            
            setTimeout(() => {
                successDiv.style.transform = 'translateX(400px)';
                setTimeout(() => document.body.removeChild(successDiv), 300);
            }, 3000);
            
        } catch (error) {
            console.error('Failed to delete project:', error);
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300';
            errorDiv.innerHTML = '✗ Error deleting project: ' + error.message;
            document.body.appendChild(errorDiv);
            
            setTimeout(() => {
                errorDiv.style.transform = 'translateX(400px)';
                setTimeout(() => document.body.removeChild(errorDiv), 300);
            }, 4000);
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalOpen(false);
        setProjectToDelete(null);
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
            const response = await fetch(`https://aura-x.up.railway.app/api/projects/${currentProject._id}`, {
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

    const handleRefresh = async () => {
        setRefreshing(true);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    };

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto"></div>
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 absolute top-2 left-2 animate-pulse"></div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700 animate-pulse">Loading your project...</p>
            <div className="flex justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200 flex justify-center items-center px-4">
                <div className="text-center bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                    <div className="text-6xl mb-4">🔒</div>
                    <p className="text-lg text-gray-700">{errorMessage || 'Please log in to view your projects.'}</p>
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return <ProjectPage />;
    }

    const renderGridView = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {projects.map((project, index) => (
                <div
                    key={project._id}
                    className="bg-white shadow-lg rounded-xl p-4 md:p-6 flex flex-col space-y-4 transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer transform"
                    style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                    }}
                    onClick={() => handleProjectClick(project._id)}
                >
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg">
                            <FaUsers size={window.innerWidth < 768 ? 18 : 24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg md:text-xl font-semibold text-gray-800 truncate">
                                {project.name}
                            </h2>
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs md:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200 block truncate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {project.url}
                            </a>
                        </div>
                    </div>
                    <div className="flex justify-between border-t pt-3 md:pt-4 text-gray-600">
                        <button
                            className="flex items-center space-x-1 md:space-x-2 hover:text-green-600 transition-all duration-200 p-2 rounded-lg hover:bg-green-50 text-sm group"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project);
                            }}
                        >
                            <FaEdit size={14} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                            className="flex items-center space-x-1 md:space-x-2 text-gray-500 hover:text-red-600 transition-all duration-200 p-2 rounded-lg hover:bg-red-50 text-sm group hover:shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteClick(project);
                            }}
                        >
                            <FaTrash size={14} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderListView = () => (
        <div className="space-y-3 md:space-y-4">
            {projects.map((project, index) => (
                <div
                    key={project._id}
                    className="bg-white shadow-lg rounded-xl p-4 md:p-6 flex items-center justify-between transition-all duration-300 hover:shadow-2xl cursor-pointer transform hover:scale-[1.02]"
                    style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInLeft 0.6s ease-out forwards'
                    }}
                    onClick={() => handleProjectClick(project._id)}
                >
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1 min-w-0">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg flex-shrink-0">
                            <FaUsers size={window.innerWidth < 768 ? 18 : 20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-base md:text-lg font-semibold text-gray-800 truncate">
                                {project.name}
                            </h2>
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs md:text-sm text-blue-500 hover:text-blue-700 transition-colors duration-200 block truncate"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {project.url}
                            </a>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 md:space-x-4 text-gray-600 flex-shrink-0">
                        <button
                            className="flex items-center space-x-1 md:space-x-2 hover:text-green-600 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-green-50 transition-all duration-200 text-sm group"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(project);
                            }}
                        >
                            <FaEdit size={14} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                            className="flex items-center space-x-1 md:space-x-2 text-gray-500 hover:text-red-600 px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-red-50 transition-all duration-200 text-sm group hover:shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteClick(project);
                            }}
                        >
                            <FaTrash size={14} className="group-hover:scale-110 transition-transform duration-200" />
                            <span className="hidden sm:inline">Delete</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-200">
            <Navbar1 
              isHelpModalOpen={isHelpModalOpen}
              setIsHelpModalOpen={setIsHelpModalOpen}
            />
            <div className="px-4 md:px-6 lg:px-8 pt-6 md:pt-8 pb-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                        <Link
                            to="/createproject"
                            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            + New Project
                        </Link>
                        <button
                            type="button"
                            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 flex items-center justify-center space-x-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-medium hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleRefresh}
                            disabled={refreshing}
                        >
                            <FaSync className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center space-x-1 bg-white rounded-lg shadow-lg p-1 w-full sm:w-auto">
                        <button
                            className={`flex items-center justify-center space-x-2 px-3 md:px-4 py-2 rounded-md transition-all duration-300 flex-1 sm:flex-none ${
                                viewMode === 'grid'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setViewMode('grid')}
                        >
                            <FaTh size={14} />
                            <span className="text-sm">Grid</span>
                        </button>
                        <button
                            className={`flex items-center justify-center space-x-2 px-3 md:px-4 py-2 rounded-md transition-all duration-300 flex-1 sm:flex-none ${
                                viewMode === 'list'
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setViewMode('list')}
                        >
                            <FaList size={14} />
                            <span className="text-sm">List</span>
                        </button>
                    </div>
                </div>

                {/* Projects Display */}
                <div className="transition-all duration-500 ease-in-out">
                    {viewMode === 'grid' ? renderGridView() : renderListView()}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <div 
                        className="bg-white shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto transform transition-all duration-300 border-t-4 border-red-500"
                        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
                    >
                        {/* Warning Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                                <FaExclamationTriangle className="text-red-500 text-2xl animate-pulse" />
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">
                                Delete Project
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to delete this project? This action cannot be undone.
                            </p>
                            {projectToDelete && (
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                                            <FaUsers size={16} />
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-800 truncate">
                                                {projectToDelete.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 truncate">
                                                {projectToDelete.url}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium transform hover:scale-105 disabled:opacity-50"
                                onClick={handleDeleteCancel}
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                onClick={handleDeleteConfirm}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaTrash size={16} />
                                        <span>Delete Project</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
                    style={{ animation: 'fadeIn 0.3s ease-out' }}
                >
                    <div 
                        className="bg-white shadow-2xl rounded-xl p-6 md:p-8 w-full max-w-md mx-auto transform transition-all duration-300"
                        style={{ animation: 'modalSlideIn 0.3s ease-out' }}
                    >
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center text-gray-800">
                            Edit Project
                        </h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentProject?.name || ''}
                                    onChange={handleInputChange}
                                    className="block w-full border-2 border-gray-300 rounded-lg py-2 md:py-3 px-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project URL
                                </label>
                                <input
                                    type="url"
                                    name="url"
                                    value={currentProject?.url || ''}
                                    onChange={handleInputChange}
                                    className="block w-full border-2 border-gray-300 rounded-lg py-2 md:py-3 px-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Project Domain
                                </label>
                                <input
                                    type="text"
                                    name="domain"
                                    value={currentProject?.domain || ''}
                                    onChange={handleInputChange}
                                    className="block w-full border-2 border-gray-300 rounded-lg py-2 md:py-3 px-4 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6 md:mt-8">
                                <button
                                    type="button"
                                    className="w-full sm:w-auto px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-200 font-medium"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Help Modal */}
            {isHelpModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
                <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-8 transform transition-all duration-500 ${
                  isHelpModalOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
                }`}>
                  
                  {/* Close Button */}
                  <button
                    className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 transition-all duration-300 rounded-full hover:bg-red-50 hover:scale-110"
                    onClick={() => setIsHelpModalOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                        <HelpCircle className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Help Center</h2>
                        <p className="text-gray-600 text-sm">Find answers to common questions</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {[
                        { 
                          q: "What is a heatmap, and how can it help my website?", 
                          icon: <Flame className="h-6 w-6 text-orange-500" />,
                          gradient: "from-orange-50 to-red-50"
                        },
                        { 
                          q: "How do I interpret the heatmap data?", 
                          icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
                          gradient: "from-blue-50 to-indigo-50"
                        },
                        { 
                          q: "What CSS changes should I consider based on my heatmap results?", 
                          icon: <Palette className="h-6 w-6 text-purple-500" />,
                          gradient: "from-purple-50 to-pink-50"
                        },
                      ].map((item, index) => (
                        <div key={index} className={`group flex items-start space-x-4 p-5 rounded-2xl bg-gradient-to-r ${item.gradient} hover:shadow-lg transition-all duration-300 cursor-pointer border border-white/50`}>
                          <div className="flex-shrink-0 p-2 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                          <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300 font-medium">
                            {item.q}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-gray-200/50">
                      <p className="text-center text-gray-500 text-sm">
                        Need more help? 
                        <button className="ml-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300 hover:underline">
                          Contact Support →
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .animation-delay-150 {
                    animation-delay: 150ms;
                }
            `}</style>
        </div>
    );
};

export default MyProjects;