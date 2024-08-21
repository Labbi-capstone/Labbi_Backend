import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import axios from "axios";
import app from "./app.js"; // Import your Express app

dotenv.config();

// Set the server port with a default of 3000 if not specified in environment variables
const port = process.env.PORT || 3000;

// Create the HTTP server using the Express app
const server = http.createServer(app);

// WebSocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Function to fetch Prometheus data
  const fetchPrometheusData = async () => {
    try {
      const response = await axios.get(
        "http://14.224.155.240:10000/prometheus/api/v1/query?query=go_gc_duration_seconds",
        {
          headers: {
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
          },
        }
      );

      if (response.data) {
        ws.send(JSON.stringify(response.data));
      }
    } catch (error) {
      console.error("Error fetching Prometheus data:", error.message);
    }
  };

  // Fetch data every second
  const intervalId = setInterval(fetchPrometheusData, 1000);

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
