// Creating the app routes
const express = require("express");
require("dotenv").config();
const connectDB = require("./db/db");
const path = require("path");
const app = express();
const routes = require("./routes/routes");
const authMiddleware = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const flashMessageMiddleware = require("./middleware/flashMessage");

// Including the ejs engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
connectDB();
app.use(cookieParser());
app.use(authMiddleware);
app.use(flashMessageMiddleware);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
