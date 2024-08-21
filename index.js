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

  // Simulated response to be sent immediately when the client connects
  const simulatedResponse = {
    status: "success",
    data: {
      resultType: "vector",
      result: [
        {
          metric: {
            __name__: "go_gc_duration_seconds",
            instance: "localhost:9090",
            job: "prometheus",
            quantile: "0",
          },
          value: [Date.now(), "0.000094904"],
        },
        {
          metric: {
            __name__: "go_gc_duration_seconds",
            instance: "localhost:9090",
            job: "prometheus",
            quantile: "0.25",
          },
          value: [Date.now(), "0.000108405"],
        },
        // Additional data...
      ],
    },
  };

  ws.send(JSON.stringify(simulatedResponse)); // Send data immediately upon connection

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
