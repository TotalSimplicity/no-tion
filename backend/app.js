const express = require("express");
const dotenv = require("dotenv");
require("dotenv").config({ path: "../.env" });
const bodyParser = require("body-parser");
const http = require("http");
const mongoose = require("mongoose");
const noteRoute = require("./routes/note");
const db = require("./db");

const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/note", noteRoute);
console.log("3");
http.createServer(app).listen(3001, () => {
  console.log("HTTP backend is running on 3001 successfully");
});
