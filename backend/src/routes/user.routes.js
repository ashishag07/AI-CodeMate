import express from "express";
import { body } from "express-validator";
import * as UserController from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  body("email").isEmail().withMessage("Email must be valid email ..."),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should have at least 3 characters ..."),
  UserController.registerUser
);

userRouter.post(
  "/login",
  body("email").isEmail().withMessage("Email must be valid email ..."),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should have at least 3 characters ..."),
  UserController.loginUser
);

export default userRouter;
