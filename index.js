// Import the express application and database configuration
const app = require("./app");
const db = require("./config/db");

// Set the server port with a default of 8080 if not specified in environment variables
const port = 8080 || process.env.PORT;

// Define a route for the root URL
app.get("/", (req, res) => {
  // Response handling for root route can be implemented here
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
