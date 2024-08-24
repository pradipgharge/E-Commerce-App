const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

//route to create a new user
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    //check if user already exists
    const user = await User.findOne({ username: username });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create a new user
    const newUser = new User({ username: username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

//route to signin a user
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    //Check if user exists
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid username or password" });
    }

    //Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Create a token
    const token = jwt.sign({ userId: user._id }, "ecomsecret", {
      expiresIn: "1h",
    });

    // Respond with token and user info
    res
      .status(200)
      .json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
