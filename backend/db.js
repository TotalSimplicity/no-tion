// db.js
require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const mongoURI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/mainapp?authSource=admin`;
console.log("Mongo URI:", mongoURI);
console.log("Mongo User:", process.env.MONGO_USER);
mongoose
  .connect(mongoURI, {
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));
