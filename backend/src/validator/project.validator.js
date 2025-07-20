import { body, param } from "express-validator";
import { mongo } from "mongoose";

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

export const updateUsersInProjectValidation = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required")
    .bail()
    .isMongoId()
    .withMessage("Invalid project ID format"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("Users must be a non-empty array of user IDs")
    .bail()
    .custom((users) =>
      users.every(
        (userId) => typeof userId === "string" && mongo.ObjectId.isValid(userId)
      )
    )
    .withMessage("Each user ID must be a valid MongoDB ObjectId"),
];
