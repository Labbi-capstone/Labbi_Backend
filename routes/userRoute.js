// Import necessary modules and controllers
const express = require("express");
const User = require("../models/userModel");
const UserController = require("../controllers/userController");

// Initialize express router
const router = express.Router();

// Route for user registration
router.post("/register", UserController.register);
// Route for user login
router.post("/login", UserController.login);

// Export the router for use in the main app
module.exports = router;
