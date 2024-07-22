// Import necessary modules for the application
import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";

// Initialize express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use userRouter for handling root path requests
app.use("/", userRouter);

// Export the express app for use in other files
export default app;
