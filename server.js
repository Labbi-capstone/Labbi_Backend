import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import axios from "axios";
import app from "./app.js"; // Import your Express app
import connectDB from "./config/db.js";
import PrometheusEndpoint from "./models/prometheusEndpointModel.js";

dotenv.config();

// Set the server port with a default of 3000 if not specified in environment variables
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    console.log("Received message from client:", message);

    // Use the provided ID to fetch the Prometheus endpoint
    const endpointId = "66c6479710635f4d63b6d08b";

    // Logging to verify that the process is continuing
    console.log(`Fetching endpoint with ID: ${endpointId}`);

    let endpoint;
    try {
      // Log the database query attempt
      console.log("Attempting to query the database for the endpoint...");
      endpoint = await PrometheusEndpoint.findById(endpointId);
      if (!endpoint) {
        console.log("Endpoint not found in the database.");
        ws.send(JSON.stringify({ error: "Endpoint not found" }));
        return;
      }
      console.log(`Database query result: ${JSON.stringify(endpoint)}`);
    } catch (dbError) {
      console.error("Error querying the database:", dbError.message);
      ws.send(
        JSON.stringify({
          error: "Failed to query the database",
          details: dbError.message,
        })
      );
      return;
    }

    const url = `${endpoint.baseUrl}${endpoint.path}${endpoint.query}`;
    console.log(`Constructed URL: ${url}`);

    try {
      console.log("Sending request to Prometheus API...");
      // Set a timeout for the axios request to avoid hanging
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
        },
        timeout: 5000, // 5 seconds timeout
      });
      console.log(
        "Received data from Prometheus API:",
        JSON.stringify(response.data)
      );

      // Send the response data to the WebSocket client
      ws.send(JSON.stringify(response.data));
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out");
      } else {
        console.error("Error fetching Prometheus data:", error.message);
      }
      ws.send(
        JSON.stringify({
          error: "Failed to fetch Prometheus data",
          details: error.message,
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
