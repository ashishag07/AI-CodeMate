import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    // get token from header or cookies
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        error: "User is not authorized ....",
      });
    }

    const isVerified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!isVerified) {
      return res.status(400).json({
        error: "User is not authorized. Invalid token ....",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "OOps! Something went wrong ...",
      error: err,
    });
  }
};

export default auth;
