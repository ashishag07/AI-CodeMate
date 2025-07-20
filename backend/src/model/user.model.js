import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    minlength: [6, "Email must be at least 6 character long ..."],
    maxlength: [50, "Email must not be longer than 50 character"],
    required: [true, "Email is required ..."],
    lowercase: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required ..."],
    minlength: [3, "Password should have at least 3 characters ..."],
    select: false,
  },
});

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateJWTToken = function () {
  const token = jwt.sign({ email: this.email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });

  return token;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
