const express = require('express')
const User = require('../models/userModel')
const UserController = require("../controllers/userController")

const router = express.Router()

router.post('/signup', UserController.register)

module.exports = router