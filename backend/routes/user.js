const express = require("express");
const router = express.Router();
const { expressjwt: jwt } = require("express-jwt");
const jwtSign = require("jsonwebtoken").sign;
const db = require("../db");
const crypto = require("crypto-js");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;
const { authenticateToken } = require("../utils/tokenAuth");

async function verifyPassword(username, plainPassword) {
  const user = await User.findOne({ username }).select("+passwordHash");
  
  
  if (user === null) {
    return false;
  }
  const hashedPassword = crypto.MD5(plainPassword).toString();
  console.log("server pass", user.passwordHash);
  console.log("pass input", hashedPassword);
  console.log(user.passwordHash === hashedPassword);
  return user.passwordHash === hashedPassword;
}

async function getUserByUsername(username) {
  const user = await User.find({ username });
  if (!user) {
    return null;
  }
  return user;
}

router.post("/login", async (req, res) => {
  const { username, plainPassword } = req.body;
  try {
    const passwordVerified = await verifyPassword(username, plainPassword);
    if (!passwordVerified) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwtSign({ username: username }, JWT_SECRET, {
      expiresIn: "604800s",
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });;
  }
});

router.post("/register", async (req, res) => {
  const { username, plainPassword, displayName } = req.body;
  if (!username || !plainPassword || !displayName)
    return res.status(400).json({ error: "please fill out all fields" });
  const existingUser = await User.find({ username });
  if (existingUser.length > 0)
    return res
      .status(400)
      .json({ error: "there is already a user with this username" });
  const hashedPassword = crypto.MD5(plainPassword).toString();
  const newUser = new User({
    username,
    passwordHash: hashedPassword,
    displayName,
  });
  try {
    await newUser.save();
    const token = jwtSign({ username: username }, JWT_SECRET, {
      expiresIn: "604800",
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
});

router.get("/verify-token", authenticateToken, (req, res) => {
  res.status(200).json({ message: "Token is valid" });
});

module.exports = router;
