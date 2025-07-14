import mongoose from "mongoose";

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongodb database server ...");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
