const express = require("express");
const morgan = require("morgan");
const connectDB = require("./database");

const app = express();

connectDB();

app.set("port", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use("/auth", require("./routes/auth.routes"));
app.use("/url", require("./routes/url.routes"));

module.exports = app;
