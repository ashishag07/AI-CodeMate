import UserModel from "./user.model.js";

export const addNewUser = async (email, password) => {
  const hashedPassword = await UserModel.hashPassword(password);
  const userObj = {
    email,
    password: hashedPassword,
  };
  return await new UserModel(userObj).save();
};

export const findUser = async (email, withPassword = false) => {
  if (withPassword) {
    return await UserModel.findOne({ email: email }).select("password");
  }
  return await UserModel.findOne({ email: email });
};
