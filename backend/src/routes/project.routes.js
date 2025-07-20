import express from "express";
import * as projectController from "../controller/project.controller.js";
import {
  createProjectValidation,
  getProjectByIdValidation,
  updateUsersInProjectValidation,
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
  "/user-projects",
  projectController.getUserProjectsController
);

projectRouter.get(
  "/:id",
  getProjectByIdValidation,
  projectController.getProjectByIdController
);
projectRouter.put(
  "/add-users",
  updateUsersInProjectValidation,
  projectController.updateUsersInProjectController
);

export default projectRouter;
