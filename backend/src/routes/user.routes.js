import express from "express";
import { body } from "express-validator";
import * as UserController from "../controller/user.controller.js";
import auth from "../middleware/auth.middleware.js";
import { registerUserValidation } from "../validator/user.validator.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  registerUserValidation,
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

userRouter.get("/profile", auth, (req, res) => {
  console.log("Authorization implemented successfully ...");
  return res.send("profile fetched successfully");
});
export default userRouter;
