const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const mongoose = require("mongoose");
const noteRoute = require("./routes/note");
const userRoute = require("./routes/user");
const db = require("./db");
const { authenticateToken } = require("./utils/tokenAuth");

const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/note", authenticateToken, noteRoute);
app.use("/user", userRoute);
console.log("1");
http.createServer(app).listen(3001, () => {
  console.log("HTTP backend is running on 3001 successfully");
});
