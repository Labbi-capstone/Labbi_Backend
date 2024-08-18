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
    const { email, password } = req.body;
    const user = await UserService.checkUser(email);
    if (!user) throw new Error("User does not exist");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Wrong password");

    const accesstoken = await UserService.createAccessToken({ id: user._id });
    const refreshtoken = await UserService.createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refreshtoken, {
      httpOnly: true,
      path: "/users/refresh-token",
      secure: true,
    });

    // Include the user role in the response
    res.status(200).json({
      status: true,
      token: accesstoken,
      user: {
        role: user.role, // Include the role in the response
      },
    });
  } catch (error) {
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

