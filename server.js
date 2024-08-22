import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./config/db.js";
import PrometheusEndpoint from "./models/prometheusEndpointModel.js";
import app from "./app.js"; // Import your Express app

dotenv.config();

// Set the server port with a default of 3000 if not specified in environment variables
const port = process.env.PORT || 3000;

// Connect to database
connectDB();



// Create the HTTP server using the Express app
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    console.log("Received message from client:", message);

    // Use the provided ID to fetch the Prometheus endpoint
    const endpointId = "66c65a1f48ce26e4b4cb8a01"; // Replace with the ID you want to test

    try {
      console.log("Fetching Prometheus endpoint from the database...");
      const endpoint = await PrometheusEndpoint.findById(endpointId);

      if (!endpoint) {
        console.log("Endpoint not found in the database");
        ws.send(JSON.stringify({ error: "Endpoint not found" }));
        return;
      }

      const url = `${endpoint.baseUrl}${endpoint.path}${endpoint.query}`;
      console.log(`Constructed URL: ${url}`);

      try {
        console.log("Sending request to Prometheus API...");
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          },
        });

        console.log(
          "Received data from Prometheus API:",
          JSON.stringify(response.data, null, 2)
        );


        // Send the response data to the WebSocket client
        ws.send(JSON.stringify(response.data));
      } catch (apiError) {
        console.error("Failed to fetch Prometheus data:", apiError.message);
        ws.send(
          JSON.stringify({
            error: "Failed to fetch Prometheus data",
            details: apiError.message,
          })
        );
      }
    } catch (dbError) {
      console.error("Database error:", dbError.message);
      ws.send(
        JSON.stringify({
          error: "Failed to retrieve endpoint from the database",
          details: dbError.message,
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected"); 
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
