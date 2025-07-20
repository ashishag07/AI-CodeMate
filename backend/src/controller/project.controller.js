import * as projectRepo from "../repository/project.repo.js";
import UserModel from "../model/user.model.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Project creation failed !! Validation failed ...",
      error: errors.array(),
    });
  }

  const { name } = req.body;
  const email = req.user.email;

  try {
    // find the user by email
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Project creation failed !! Authenticated user not found ...",
      });
    }

    const newProject = await projectRepo.createProject(user._id, name);

    return res.status(201).json({
      status: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      status: false,
      message: "Project createion failed !! Internal server error ...",
      error: error,
    });
  }
};

export const getAllProjectsController = async (req, res) => {
  try {
    const projects = await projectRepo.getAllProjects();
    return res.status(200).json({
      status: true,
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    return res.status(500).json({
      status: false,
      message: "Error in fetching projects !! Internal server error",
      error: error,
    });
  }
};

export const getProjectByIdController = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Project retrieval failed !! Validation failed ...",
      error: errors.array(),
    });
  }
  const { id } = req.params;
  const email = req.user.email;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Project retrieval failed !! Authenticated user not found ...",
      });
    }

    const project = await projectRepo.getProjectById(id, user._id);

    if (!project) {
      return res.status(404).json({
        status: false,
        message: "Project retrieval failed !! Project not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    console.error("Error retrieving project:", error);
    return res.status(500).json({
      status: false,
      message: "Project retrieval failed !! Internal server error",
      error: error,
    });
  }
};

export const getUserProjectsController = async (req, res) => {
  const email = req.user.email;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Project retrieval failed !! Authenticated user not found",
      });
    }

    const projects = await projectRepo.getProjectsByUserId(user._id);

    return res.status(200).json({
      status: true,
      message: "User projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.error("Error retrieving user projects:", error);
    return res.status(500).json({
      status: false,
      message: "User projects retrieval failed !! Internal server error",
      error: error,
    });
  }
};

export const updateUsersInProjectController = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Project update failed !! Validation failed ...",
      error: errors.array(),
    });
  }

  const { projectId, users } = req.body;
  const email = req.user.email;

  try {
    // find authenticated user by email
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Project update failed !! Authenticated user not found",
      });
    }

    // find if the user is authorized to update the project
    const project = await projectRepo.getProjectById(projectId, user._id);
    if (!project) {
      return res.status(404).json({
        status: false,
        message:
          "Project update failed !! Project not found or user not authorized",
      });
    }

    // Update users in the project
    const updatedProject = await projectRepo.updateUsersInProject(
      projectId,
      users
    );

    return res.status(200).json({
      status: true,
      message: "Project users updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project users:", error);
    return res.status(500).json({
      status: false,
      message: "Project update failed !! Internal server error",
      error: error,
    });
  }
};
