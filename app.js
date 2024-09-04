import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import organizationRouter from "./routes/organizationRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";
import chartRoute from "./routes/chartRoute.js"; // Import the new chart route
import prometheusRoutes from "./routes/prometheusRoutes.js";


const app = express();

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Use the Prometheus routes
app.use('/api/prometheus', prometheusRoutes);
// Register routes for the application
app.use("/api/users", userRouter);
app.use("/api/organizations", organizationRouter);
app.use("/api/dashboards", dashboardRoute);
app.use("/api/charts", chartRoute); // Register the chart route

// Root route for health check or basic info
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Export the express app for use in other files
export default app;
