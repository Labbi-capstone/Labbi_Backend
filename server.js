import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./config/db.js";
import PrometheusEndpoint from "./models/prometheusEndpointModel.js";
import app from "./app.js";

dotenv.config();

const port = process.env.PORT || 3000;
connectDB();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Track clients and their associated intervals
const clients = new Map();

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    try {
      const { prometheusEndpointId, chartType, chartId } = JSON.parse(message);
      console.log(
        `Processing for Chart ID: ${chartId}, Endpoint ID: ${prometheusEndpointId}, Chart Type: ${chartType}`
      );

      // Clear any existing interval for this chartId and client
      if (clients.has(ws)) {
        const clientData = clients.get(ws);
        if (clientData.chartId === chartId && clientData.interval) {
          clearInterval(clientData.interval);
          console.log(`Cleared previous interval for Chart ID: ${chartId}`);
        }
      }

      // Fetch endpoint details
      const endpoint = await PrometheusEndpoint.findById(prometheusEndpointId);
      if (!endpoint) {
        ws.send(JSON.stringify({ error: "Endpoint not found" }));
        return;
      }

      const url = `${endpoint.baseUrl}${endpoint.path}${endpoint.query}`;
      console.log(`Fetching data from URL: ${url}`);

      const fetchPrometheusData = async () => {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
          });
          if (response.data) {
            ws.send(
              JSON.stringify({
                chartId,
                chartType,
                data: response.data,
              })
            );
            console.log("Data sent to client");
          }
        } catch (error) {
          ws.send(
            JSON.stringify({ error: `Error fetching data: ${error.message}` })
          );
        }
      };

      // Fetch data immediately
      fetchPrometheusData();

      // Set an interval to fetch data every 5 seconds
      const interval = setInterval(fetchPrometheusData, 5000);

      // Store the client's data and interval
      clients.set(ws, { chartId, interval });

      // Log current active clients for debugging
      console.log(`Active clients: ${clients.size}`);

      // Clean up when the client disconnects
      ws.on("close", () => {
        console.log("Client disconnected");
        clearInterval(interval); // Ensure the interval is cleared
        clients.delete(ws); // Remove client from the Map
        console.log(`Client removed. Active clients: ${clients.size}`);
      });
    } catch (error) {
      console.error("Error processing message: ", error);
      ws.send(
        JSON.stringify({ error: "Invalid message format or internal error" })
      );
    }
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
}); 

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
 