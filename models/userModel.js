const mongoose = require('mongoose')
const db = require('../config/db')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

userSchema.pre('save', async function(){
    try {
        var user = this;
        const salt = await(bcrypt.genSalt(10));
        const hashPass = await bcrypt.hash(user.password,salt)

        user.password = hashPass
    } catch (error) {
        throw error
    }
})

module.exports = db.model('User', userSchema);