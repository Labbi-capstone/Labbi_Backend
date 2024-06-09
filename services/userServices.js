const User = require('../models/userModel')

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
}

module.exports = UserService;