// Importing the UserService to use its functionalities for user operations
import UserService from "../services/userServices.js";
import { User } from "../models/userModel.js";

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
    
    // Generate access and refresh tokens with the role included in the payload
    const accessToken = await UserService.createAccessToken({
      id: user._id,
      role: user.role, // Include the role here
    });
    console.log("Generated Access Token:", accessToken);
    const refreshToken = await UserService.createRefreshToken({
      id: user._id,
      role: user.role, // Include the role here as well
    });

    // Set the refresh token as an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/users/refresh-token",
      secure: true,
    });

    // Send the response including the user role
    res.status(200).json({
      status: true,
      token: accessToken,
      user: {
        role: user.role,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        dashboardUids: user.dashboardUids,
      },
    });
  } catch (error) {
    res.json({ status: false, message: error.message });
  }
};

// TODO: Ends the user's session.
export const logout = async (req, res) => {
  // Logic to log out a user
  try {
    res.clearCookie("refreshtoken", { path: "/users/refresh-token" });
    return res.json({ msg: "Logged out" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// TODO: Retrieves the profile information of the currently logged-in user.
export const getProfile = async (req, res) => {
  // Logic to get user's profile information
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(400).json({ msg: "User does not exist!" });

    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// TODO: Updates user information.
// Updates user information, including name, email, and password.
export const updateUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (password) {
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    await User.findByIdAndUpdate({ _id: req.params.id }, updateData);

    res.json({ msg: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// TODO: Deletes a user account.
export const deleteUser = async (req, res) => {
  // Logic to delete a user
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// TODO: Lists all users (admin functionality or for social features).
export const listUsers = async (req, res) => {
  // Logic to list all users
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    // Respond with error message if login fails
    res.json({ status: false, message: error.message });
  }
};

// TODO: Allows a user to change their password.
async function changePassword(req, res) {
  // Logic for changing password
}

async function resetPassword(req, res) {
  // Logic for resetting the password
}

// TODO: refresh token
export const refreshToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    console.log(rf_token);
    if (!rf_token)
      return res.status(400).json({ msg: "Please login or Register" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: err });
      const accesstoken = createAccessToken({ id: user.id });
      res.json({ user, accesstoken });
    });

    res.json({ rf_token });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
