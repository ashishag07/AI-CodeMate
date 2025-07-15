import * as UserRepo from "../model/user.repo.js";
import { validationResult } from "express-validator";

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "OOps! Email and Password is required ...",
      });
    }
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("I am executed");
      return res.status(400).json({
        error: errors.array(),
      });
    }

    const user = await UserRepo.addNewUser(email, password);

    return res.status(201).json({
      message: "New User is registered successfully ...",
      user: user,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
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
