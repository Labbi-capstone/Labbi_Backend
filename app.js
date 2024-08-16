// Import necessary modules for the application
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/userRoute.js";
import organizationRouter from "./routes/organizationRoute.js";

// Initialize express application
const app = express();
app.use(cors()); // This enables CORS for all origins

// More specific setup:
app.use(
  cors({
    origin: "http://localhost:3000", // Adjust the origin if needed
  })
);

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Use userRouter for handling root path requests
app.use("/api/users", userRouter);

app.use('/api/organizations', organizationRouter);


// Export the express app for use in other files
export default app;
