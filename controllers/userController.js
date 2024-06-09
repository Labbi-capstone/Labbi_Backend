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