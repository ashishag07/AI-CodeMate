import { body, param } from "express-validator";
import mongoose from "mongoose";

export const registerUserValidation = [
  body("email").trim().isEmail().withMessage("Email must be valid email ..."),
  body("password")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Password should have at least 3 characters ..."),
];
