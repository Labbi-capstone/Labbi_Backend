const UserService = require('../services/userServices');

exports.register = async(req,res,next)=>{
    try {
        const {fullname, email, password} = req.body;
        const success = await UserService.register(fullname, email, password);
        res.json({status: true, success: "Registered successfully"})
    } catch (error) {
        res.json({status: false, message: error.message})
    }
}

exports.login = async(req,res,next)=>{
    try {
        const {email, password} = req.body;
        const user = await UserService.checkUser(email)
        if (!user) {
            throw new Error('User does not exist');
        }
        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            throw new Error('Wrong password');
        }

        let tokenData = {_id: user._id, email: user.email};

        const token = await UserService.generateToken(tokenData, 'secretKet', '1h')
        
        res.status(200).json({status: true, token: token})
    } catch (error) {
        res.json({status: false, message: error.message})
    }
}