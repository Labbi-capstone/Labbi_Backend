const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

class UserService {
  // Registers a new user if email doesn't already exist
  static async register(fullname, email, password) {
    try {
      // Check for existing user by email
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Create and save new user
      const newUser = new User({ fullname, email, password });
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

module.exports = UserService;
