import { body, param } from "express-validator";

export const createProjectValidation = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Project name is required")
    .bail()
    .isString()
    .withMessage("Project name must be a string")
    .bail()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Project name must be between 3 and 50 characters"),
];

export const getProjectByIdValidation = [
  param("id").isMongoId().withMessage("Invalid project ID format"),
];
