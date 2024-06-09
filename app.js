const express = require('express');
const bodyParser = require('body-parser');
const app = express()

const userRouter = require("./routes/userRoute")

app.use(bodyParser.json())

app.use('/',userRouter);

module.exports = app;