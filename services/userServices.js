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
}

export default UserService;
