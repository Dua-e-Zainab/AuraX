const Project = require('../models/Project');

exports.getProjectByUrl = async (url) => {
  return Project.findOne({ url });
};

exports.getProjectByNameAndOwner = async (name, owner) => {
  return Project.findOne({ name, owner });
};

exports.createProject = async (data) => {
  const project = new Project(data);
  return await project.save();
};

exports.getAllProjectsByOwner = async (owner) => {
  return Project.find({ owner });
};

exports.getProjectByIdAndOwner = async (projectId, owner) => {
  return Project.findOne({ _id: projectId, owner });
};

exports.updateProjectById = async (id, data) => {
  return Project.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteProjectById = async (projectId) => {
  return Project.findByIdAndDelete(projectId);
};
