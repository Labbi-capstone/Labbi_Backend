const express = require('express')
const User = require('../models/userModel')

const router = express.Router()

router.post('/signup', async (req, res) => {
    try {
        const user = await User.findOne({ 
            email: req.body.email 
        });
        if (user === null) {
          const newUser = new User({
            email: req.body.email,
            password: req.body.password
          });
          await newUser.save();
          console.log(newUser);
          res.json(newUser);
        } else {
          res.json({ message: 'email is not available' });
        }
      } catch (error) {
        console.log(error);
        res.json(error);
      }
})

router.post('/signin', async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        })
        if(user === null){
            res.json({message: 'invalid user'});
        } else {
            console.log(user);
            res.json(user);
        }
    } catch (error) {
        console.log(error);
        res.json(error);
    }
})

module.exports = router