const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
console.log(process.env.JWT_SECRET)

// Logout Endpoint
app.get('/auth/logout', (req, res) => {
  res.clearCookie('user');
  res.redirect('/');
});

// Protected Dashboard Route
app.get('/dashboard', (req, res) => {
  const user = req.cookies.user;
  if (!user) {
    return res.redirect('/auth/login');
  }
  res.send(`<h1>Welcome to your dashboard</h1><a href="/auth/logout">Logout</a>`);
});

// Define routes
app.get('/login', (req, res) => {
    res.render('login'); // Render login.ejs
});

app.get('/services', (req, res) => {
    res.render('services'); // Render service.ejs
});

// Import Routes
const authRoutes = require("./routes/auth");
const parkingRoutes = require("./routes/parking");
const carRoutes = require("./routes/car");
const indexRoute = require("./routes/index");

// Routes Middleware
app.use("/", indexRoute);
app.use("/auth", authRoutes);
app.use("/parking", parkingRoutes);
app.use("/car", carRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Database connection error:", err));


  app.get("/", (req, res)=>{
    res.send("Server is up and running!");
  })
  
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
