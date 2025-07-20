import * as UserRepo from "../repository/user.repo.js";
import { validationResult } from "express-validator";

export const registerUser = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Registration failed !! Validation failed ...",
      error: errors.array(),
    });
  }

  const { email, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await UserRepo.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Registration failed !! Email is already registered ...",
      });
    }

    // Register new user
    const user = await UserRepo.addNewUser(email, password);

    delete user._doc.password; // Remove password from response

    return res.status(201).json({
      status: true,
      message: "Registration Successfull !! ...",
      user: user,
    });
  } catch (err) {
    console.log("Error during registration", err);
    return res.status(400).json({
      status: false,
      message: "Registration Failed !! Internal Server Error ...",
      error: err,
    });
  }
};

export const loginUser = async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: false,
      message: "Login failed !! Validation failed ...",
      error: errors.array(),
    });
  }
  const { email, password } = req.body;

  try {
    // check if user exists
    const user = await UserRepo.findUserByEmail(email, true);
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Login failed !! User not found ...",
      });
    }

    // compare password
    const isVerified = await user.comparePassword(password);
    if (!isVerified) {
      return res.status(400).json({
        status: false,
        message: "Login failed !! Invalid password ...",
      });
    }

    // generate JWT Token
    const token = user.generateJWTToken();

    // delete password field
    delete user._doc.password;

    return res.status(200).json({
      status: true,
      message: "Login successful !! ...",
      user: user,
      token: token,
    });
  } catch (err) {
    console.log("Error during login", err);
    return res.status(400).json({
      status: false,
      message: "Login Failed !! Internal Server Error ...",
      error: err,
    });
  }
};

export const getAllUsers = async (req, res) => {
  const email = req.user.email; // Get email from authenticated user

  try {
    // Get the user from email
    const user = await UserRepo.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        status: false,
        message:
          "Fetching all users failed !! Unauthorized Access !! User not found ...",
      });
    }

    // Fetch all users except the authenticated user
    const users = await UserRepo.findAllUsers(user._id);

    return res.status(200).json({
      status: true,
      message: "All users fetched successfully ...",
      users: users,
    });
  } catch (err) {
    console.log("Error during fetching all users", err);
    return res.status(400).json({
      status: false,
      message: "Fetching all users failed !! Internal Server Error ...",
      error: err,
    });
  }
};
