import express from "express";
import * as projectController from "../controller/project.controller.js";
import {
  createProjectValidation,
  getProjectByIdValidation,
} from "../validator/project.validator.js";

const projectRouter = express.Router();

// Define routes for project management
projectRouter.post(
  "/create",
  createProjectValidation,
  projectController.createProjectController
);

projectRouter.get("/all", projectController.getAllProjectsController);

projectRouter.get(
  "/:id",
  getProjectByIdValidation,
  projectController.getProjectByIdController
);

projectRouter.get(
  "/user-projects",
  projectController.getUserProjectsController
);

export default projectRouter;
