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

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9]*@gmail\.com$/;
    if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
   }

    // Check if username is provided
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
   
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie('user', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day cookie
    // res.redirect('/');
    return res.status(201).json({ message: "User registered successfully" });
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
  console.log("login function called")
  try {
    const { email , password } = req.body;

     // Check if email and password are provided
     if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user by username
    const user = await User.findOne({ email });
    if (!user) {
      console.log("email not found");
      return res.status(401).json({ error: "email is required" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      res.redirect("/user/dashboard");
      res.status(401).json({ error: "Invalid credentials" });
    }

  // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); 
    res.cookie('user', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

  // Successful login
    // res.status(200).json({ message: "Login successful", user });
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
    res.redirect('/');
  }
});

module.exports = router;
