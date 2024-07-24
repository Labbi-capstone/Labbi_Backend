// Importing the UserService to use its functionalities for user operations
import UserService from "../services/userServices.js";

// Controller function for handling user registration
export const register = async (req, res, next) => {
  try {
    // Extract user details from request body
    const { fullName, email, password } = req.body;
    // Register the user using UserService
    await UserService.register(fullName, email, password);
    // Respond with success message if registration is successful
    res.json({ status: true, success: "Registered successfully" });
  } catch (error) {
    // Respond with error message if registration fails
    res.json({ status: false, message: error.message });
  }
};

// Controller function for handling user login
export const login = async (req, res, next) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;
    // Verify user existence
    const user = await UserService.checkUser(email);
    if (!user) {
      throw new Error("User does not exist");
    }
    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Wrong password");
    }
    // Prepare token data
    let tokenData = { _id: user._id, email: user.email };
    // Generate authentication token
    const token = await UserService.generateToken(tokenData, "secretKey", "1h");

    // Respond with token if login is successful
    res.status(200).json({ status: true, token: token });
  } catch (error) {
    // Respond with error message if login fails
    res.json({ status: false, message: error.message });
  }
};

// TODO: Ends the user's session.
async function logout(req, res) {
    // Logic to log out a user
}

// TODO: Retrieves the profile information of the currently logged-in user.
async function getProfile(req, res) {
    // Logic to get user's profile information
}

// TODO: Updates user information.
async function updateUser(req, res) {
    // Logic to update user information
}

// TODO: Deletes a user account.
async function deleteUser(req, res) {
    // Logic to delete a user
}

// TODO: Lists all users (admin functionality or for social features).
async function listUsers(req, res) {
    // Logic to list all users
}

// TODO: Allows a user to change their password.
async function changePassword(req, res) {
    // Logic for changing password
}

async function resetPassword(req, res) {
    // Logic for resetting the password
}

