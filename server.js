require("dotenv").config();
require("./src/configs/dbConnection");
const express = require("express");
const app = express();
const port = process.env.PORT;
const morgan = require("morgan");
const fileUpload = require("express-fileupload");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(fileUpload());

const userRoutes = require("./src/routes/user");

app.use("/users", userRoutes);

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
