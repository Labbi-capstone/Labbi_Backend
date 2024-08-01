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

    // if login success, create accesstoken and rftoken
    const accesstoken = await UserService.createAccessToken({ id: user._id });
    const refreshtoken = await UserService.createRefreshToken({ id: user._id });

    res.cookie('refreshtoken', refreshtoken, {
      httpOnly: true,
      path: "/users/refresh-token",
      secure: true,
    });
    
    // Generate authentication token
    // const token = await UserService.generateToken(tokenData, "secretKey", "1h");

    // Respond with token if login is successful
    res.status(200).json({ status: true, token: accesstoken });
  } catch (error) {
    // Respond with error message if login fails
    res.json({ status: false, message: error.message });
  }
};

// TODO: Ends the user's session.
export const logout = async (req, res) => {
    // Logic to log out a user
    try {
      res.clearCookie('refreshtoken', { path: "/users/refresh-token" });
      return res.json({ msg: "Logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
}

// TODO: Retrieves the profile information of the currently logged-in user.
export const getProfile = async (req, res) => {
    // Logic to get user's profile information
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user)
        return res.status(400).json({ msg: "User does not exist!" });

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
}

// TODO: Updates user information.
export const updateUser = async (req, res) => {
    // Logic to update user information
    try {
      const { fullName, email } =
        req.body;

      await User.findByIdAndUpdate(
        { _id: req.params.id },
        {
          fullName,
          email,
        }
      );

      res.json({ msg: "Updated user" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
}

// TODO: Deletes a user account.
export const deleteUser = async (req, res) => {
    // Logic to delete a user
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ msg: "User deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
}

// TODO: Lists all users (admin functionality or for social features).
export const listUsers = async (req, res) => {
    // Logic to list all users
    try {
      const users = await User.find();
      res.status(200).json({users});
    } catch (error) {
      // Respond with error message if login fails
      res.json({ status: false, message: error.message });
    }
}

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
    console.log(rf_token)
    if (!rf_token)
      return res.status(400).json({ msg: "Please login or Register" });

    jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(400).json({ msg: err });
      const accesstoken = createAccessToken({ id: user.id });
      res.json({user, accesstoken });
    });

    res.json({ rf_token });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
}

