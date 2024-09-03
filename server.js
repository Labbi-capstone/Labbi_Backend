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

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    console.log("Received message:", message); // Log the received message
    const { prometheusEndpointId, chartType } = JSON.parse(message);
    console.log(
      `Processing for Endpoint ID: ${prometheusEndpointId}, Chart Type: ${chartType}`
    ); // Log details
    try {
      const { prometheusEndpointId, chartType } = JSON.parse(message);
      console.log(`Received message: ${message}`);

      const endpoint = await PrometheusEndpoint.findById(prometheusEndpointId);
      if (!endpoint) {
        console.log(
          `Endpoint ${prometheusEndpointId} not found in the database`
        );
        ws.send(JSON.stringify({ error: "Endpoint not found" }));
        return;
      }

      const url = `${endpoint.baseUrl}${endpoint.path}${endpoint.query}`;
      console.log(`Fetching data from URL: ${url}`);

      const fetchPrometheusData = async (url, chartType) => {
        try {
          const response = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            },
          });
          console.log(`Fetched data for ${chartType}:`, response.data);

          if (response.data) {
            ws.send(JSON.stringify({ chartType, data: response.data }));
             console.log(`SEND DATA FOR ${chartType}:`, response.data);
          }
        } catch (error) {
          console.error(
            `Error fetching ${chartType} data from Prometheus:`,
            error.message
          );
          ws.send(
            JSON.stringify({ error: `Error fetching data: ${error.message}` })
          );
        }
      };

      fetchPrometheusData(url, chartType);

      ws.on("close", () => {
        console.log("Client disconnected");
      });
    } catch (error) {
      console.error(
        `Error handling Prometheus endpoint request:`,
        error.message
      );
      ws.send(JSON.stringify({ error: "Invalid request format" }));
    }
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
