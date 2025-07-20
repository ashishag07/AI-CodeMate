import ProjectModel from "../model/project.model.js";

export const createProject = async (userId, name) => {
  return await ProjectModel.create({
    name,
    users: [userId],
  });
};

export const getAllProjects = async () => {
  return await ProjectModel.find().populate("users", "email");
};

export const getProjectById = async (id, userId) => {
  return await ProjectModel.findOne({ _id: id, users: userId });
};

export const getProjectsByUserId = async (userId) => {
  return await ProjectModel.find({ users: userId });
};

export const updateUsersInProject = async (projectId, users) => {
  return await ProjectModel.findByIdAndUpdate(
    projectId,
    { $addToSet: { users: { $each: users } } },
    { new: true }
  ).populate("users");
};
