import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./config/db.js";
import PrometheusEndpoint from "./models/prometheusEndpointModel.js";
import app from "./app.js";

dotenv.config();

// Set the server port with a default of 3000 if not specified in environment variables
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

// Fetch the Prometheus endpoint once at the start
const endpointId = "66c65a1f48ce26e4b4cb8a03";
// const endpointId2 = "66c65a1f48ce26e4b4cb8a01";
let constructedUrl;

const initialize = async () => {
  try {
    const endpoint = await PrometheusEndpoint.findById(endpointId);
    if (!endpoint) {
      console.log("Endpoint not found in the database");
      return;
    }
console.log("ENDPOINT", endpoint);
    constructedUrl = `${endpoint.baseUrl}${endpoint.path}${endpoint.query}`;
    console.log(`Constructed URL: ${constructedUrl}`);
  } catch (error) {
    console.error(
      "Error fetching Prometheus endpoint from the database:",
      error.message
    );
  }
};

initialize();

// Create the HTTP server using the Express app
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Function to fetch Prometheus data
  const fetchPrometheusData = async () => {
    console.log("Attempting to fetch data from Prometheus...");
    if (!constructedUrl) {
      console.error("URL is not constructed, cannot fetch data.");
      return;
    }
    try {
      const response = await axios.get(constructedUrl, {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
      });
console.log("DATA:", response.data);
      if (response.data) {
        ws.send(JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error fetching Prometheus data:", error.message);
    }
  };

  // Fetch data every second
  const intervalId = setInterval(fetchPrometheusData, 2000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(intervalId); // Stop fetching data when the client disconnects
  });
});

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server and listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
