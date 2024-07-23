// Import necessary modules and controllers using ESM syntax
import express from "express";
import User from "../models/userModel.js";
import * as UserController from "../controllers/userController.js";

// Initialize express router
const router = express.Router();

// Route for user registration
router.post("/register", UserController.register);
// Route for user login
router.post("/login", UserController.login);

// Export the router for use in the main app
export default router;
