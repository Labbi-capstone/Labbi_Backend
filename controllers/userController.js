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
