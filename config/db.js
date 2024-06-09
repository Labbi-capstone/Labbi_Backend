const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb+srv://hagiangnguyen2705:Giang270599@cluster0.u1tprem.mongodb.net/').on('open', ()=>{
    console.log("Database connected")
}).on('error', ()=>{
    console.log("Connection error!")
})

module.exports = connection;