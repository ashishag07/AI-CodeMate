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
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
      });
    }
    const { email, password } = req.body;

    const user = await UserRepo.findUser(email, true);
    if (!user) {
      return res.status(400).json({
        error: "OOps! User is not found ...",
      });
    }

    // compare password
    const isVerified = await user.comparePassword(password);
    if (!isVerified) {
      return res.status(400).json({
        error: "OOps! Invalid password ...",
      });
    }

    // generate JWT Token
    const token = user.generateJWTToken();

    // delete password field
    delete user._doc.password;

    return res.status(200).json({
      message: "User loggedin successfully ...",
      user: user,
      token: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: err,
    });
  }
};
