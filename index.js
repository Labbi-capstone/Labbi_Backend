// Import the express application and database configuration using ES module syntax
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

// Set the server port with a default of 3000 if not specified in environment variables
const port = process.env.PORT || 3000;
// Connect to database
connectDB();
// Define a route for the root URL
app.get("/", (req, res) => {
  // Response handling for root route can be implemented here
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
