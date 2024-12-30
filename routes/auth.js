const express = require("express");
const path = require("path"); // Add the path module to resolve paths
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Replace with your User model path

const router = express.Router();

// User Registration Route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Page Route (HTML render)
router.get("/register", (req, res) => {
  // Use path.resolve() to resolve the absolute path
  res.render('register');
});

// Login Page Route (HTML render)
router.get("/login", (req, res) => {
  // Use path.resolve() to resolve the absolute path
  res.render('login');
});

//Login Logic
router.post("/login", async (req, res) => {
  try {
    const { email , password } = req.body;

     // Check if email and password are provided
     if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ email });
    if (!email) {
      return res.status(401).json({ error: "email is required" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

  // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

  // Successful login
    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
});
module.exports = router;

//     res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


