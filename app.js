// Import necessary modules for the application
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser"
import userRouter from "./routes/userRoute.js";
import organizationRouter from "./routes/organizationRoute.js";

// Initialize express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cookieParser())

// Use userRouter for handling root path requests
app.use("/api/users", userRouter);

app.use('/api/organizations', organizationRouter);


// Export the express app for use in other files
export default app;
