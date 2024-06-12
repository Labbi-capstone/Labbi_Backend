const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

class UserService{
    static async register(fullname, email, password){
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            
            const newUser = new User({fullname, email, password})
            return await newUser.save()
            
        } catch(error){
            throw error;
        }
    }

    static async checkUser(email){
        try {
            return await User.findOne({email})
        } catch(error){
            throw error;
        }
    }

    static async generateToken(tokenData, secretKey, jwtExpire){
        return jwt.sign(tokenData, secretKey, {expiresIn: jwtExpire})
    }
}

module.exports = UserService;