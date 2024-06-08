const express = require('express')
const app = express()
const port = 8080 || process.env.PORT
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://hagiangnguyen2705:Giang270599@cluster0.u1tprem.mongodb.net/')

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use('/', require('./routes/userRoute'))

app.listen(port, () => {
    console.log("Server is running on port " + port)
})