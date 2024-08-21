import mongoose from "mongoose";
import dotenv from "dotenv";
import PrometheusEndpoint from "../models/prometheusEndpoint.js"; // Adjust the path based on your project structure

dotenv.config(); // Load environment variables from .env

// Example data insertion
const seedEndpoints = async () => {
  try {
    // Connect to your database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Define the endpoints to be seeded
    const endpoints = [
      {
        name: "CPU Usage",
        baseUrl: "http://14.224.155.240:10000",
        queryPath: "/prometheus/api/v1/query",
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      },
      {
        name: "Memory Usage",
        baseUrl: "http://14.224.155.240:10001",
        queryPath: "/prometheus/api/v1/query",
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      },
    ];

    // Insert the endpoints into the database
    await PrometheusEndpoint.insertMany(endpoints);
    console.log("Endpoints seeded successfully");

    // Close the database connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding endpoints:", error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedEndpoints();
