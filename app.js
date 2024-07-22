// Import necessary modules for the application
const express = require("express");
const bodyParser = require("body-parser");

// Initialize express application
const app = express();

// Import routes for user operations
const userRouter = require("./routes/userRoute");

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use userRouter for handling root path requests
app.use("/", userRouter);

// Export the express app for use in other files
module.exports = app;
