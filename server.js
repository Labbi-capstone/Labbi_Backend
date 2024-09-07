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

let clients = new Set();

wss.on("connection", (ws) => {
  console.log("Client connected");
  clients.add(ws); // Track the client connection

  let interval = null;

  ws.on("message", async (message) => {
    const { prometheusEndpointId, chartType, chartId } = JSON.parse(message);

    console.log(
      `Processing for Chart ID: ${chartId}, Endpoint ID: ${prometheusEndpointId}, Chart Type: ${chartType}`
    );

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

    if (interval) {
      clearInterval(interval); // Clear the old interval if it exists
    }

    fetchPrometheusData();
    interval = setInterval(fetchPrometheusData, 10000);

    ws.on("close", () => {
      console.log("Client disconnected");
      clearInterval(interval);
      clients.delete(ws); // Remove the client from the set
    });
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
