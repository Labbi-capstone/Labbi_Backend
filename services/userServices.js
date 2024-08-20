import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

class UserService {
  // Registers a new user if email doesn't already exist
  static async register(fullName, email, password) {
    try {
      // Check for existing user by email
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create and save new user
      const newUser = new User({ fullName, email, password });
      return await newUser.save();
    } catch (error) {
      throw error;
    }
  }

  // Checks if a user exists by email
  static async checkUser(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  // Generates a JWT token for user authentication
  static async generateToken(tokenData, secretKey, jwtExpire) {
    return jwt.sign(tokenData, secretKey, { expiresIn: jwtExpire });
  }

  // Create Access Token with ID and Role
  static async createAccessToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role }, // Include role in the token payload
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
  }

  // Create Refresh Token with ID and Role
  static async createRefreshToken(user) {
    return jwt.sign(
      { id: user.id, role: user.role }, // Include role in the token payload
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
  }
}

export default UserService;
