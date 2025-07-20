import * as projectRepo from "../repository/project.repo.js";
import UserModel from "../model/user.model.js";
import { validationResult } from "express-validator";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }

  const { name } = req.body;
  const email = req.user.email;

  try {
    // find the user by email
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newProject = await projectRepo.createProject(user._id, name);
    return res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProjectsController = async (req, res) => {
  try {
    const projects = await projectRepo.getAllProjects();
    return res.status(200).json({
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.error("Error retrieving projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProjectByIdController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array(),
    });
  }
  const { id } = req.params;
  const email = req.user.email;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await projectRepo.getProjectById(id, user._id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({
      message: "Project retrieved successfully",
      project,
    });
  } catch (error) {
    console.error("Error retrieving project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserProjectsController = async (req, res) => {
  const email = req.user.email;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projects = await projectRepo.getProjectsByUserId(user._id);

    return res.status(200).json({
      message: "User projects retrieved successfully",
      projects,
    });
  } catch (error) {
    console.error("Error retrieving user projects:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
