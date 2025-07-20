import { body, param } from "express-validator";
import { mongo } from "mongoose";

export const createProjectValidation = [
  body("name")
    .isString()
    .withMessage("Project name must be a string")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Project name must be between 3 and 50 characters"),
];

export const getProjectByIdValidation = [
  param("id")
    .custom((value) => mongo.isValidObjectId(value))
    .withMessage("Invalid Project ID format"),
];
