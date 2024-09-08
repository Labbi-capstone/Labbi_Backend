// Import necessary modules and controllers using ESM syntax
import express from "express";
import { User } from "../models/userModel.js";
import * as UserController from "../controllers/userController.js";
import { authenticateUser, isAdmin } from "../middlewares/authenticate.js";

// Initialize express router
const router = express.Router();

// Route for user registration
router.post("/register", UserController.register);
// Route for user login
router.post("/login", UserController.login);
// Route for user logout
router.get("/logout", UserController.logout);
// Route for refreshing token
router.get("/refresh-token", UserController.refreshToken);
// Route for getting profile
router.get("/profile/:id", UserController.getProfile);
// Route for getting profile
router.delete("/delete/:id", UserController.deleteUser);
// Route for editing profile
router.put("/update/:id", UserController.updateUser);
// Route for updating user info (name, email, role)
router.put("/update-user-info/:id", authenticateUser, isAdmin, UserController.updateUserInfo);
// Route for updating user password
router.put("/update-password/:id", authenticateUser, UserController.updateUserPassword);
// Route for listing users
router.get("/", authenticateUser, isAdmin, UserController.listUsers);
// Export the router for use in the main app
export default router;
