// Import necessary modules for the application
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import organizationRouter from "./routes/organizationRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

// Initialize express application
const app = express();

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Register routes for the application
app.use("/api/users", userRouter);
app.use("/api/organizations", organizationRouter);
app.use("/api/dashboards", dashboardRoute);

// Root route for health check or basic info
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Export the express app for use in other files
export default app;
