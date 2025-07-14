import server from "./src/app.js";
import connectDB from "./src/config/mondogdb.config.js";

server.listen(process.env.PORT, (req, res) => {
  console.log(`Server is started at port ${process.env.PORT} !!`);
  connectDB();
});
