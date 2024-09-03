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
//66c65a1f48ce26e4b4cb8a03
//66c65a1f48ce26e4b4cb8a01
const endpointIdForLineChart = "66c65a1f48ce26e4b4cb8a03";
const endpointIdForBarChart = "66c65a1f48ce26e4b4cb8a03";

let constructedUrls = {};

const initializeEndpoints = async () => {
  try {
    const lineChartEndpoint = await PrometheusEndpoint.findById(
      endpointIdForLineChart
    );
    if (!lineChartEndpoint) {
      console.log("Line Chart Endpoint not found in the database");
      return;
    }
    constructedUrls.lineChartUrl = `${lineChartEndpoint.baseUrl}${lineChartEndpoint.path}${lineChartEndpoint.query}`;
    console.log(`Line Chart URL: ${constructedUrls.lineChartUrl}`);

    const barChartEndpoint = await PrometheusEndpoint.findById(
      endpointIdForBarChart
    );
    if (!barChartEndpoint) {
      console.log("Bar Chart Endpoint not found in the database");
      return;
    }
    constructedUrls.barChartUrl = `${barChartEndpoint.baseUrl}${barChartEndpoint.path}${barChartEndpoint.query}`;
    console.log(`Bar Chart URL: ${constructedUrls.barChartUrl}`);
  } catch (error) {
    console.error(
      "Error fetching Prometheus endpoints from the database:",
      error.message
    );
  }
};

initializeEndpoints();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("Client connected");

const fetchPrometheusData = async (url, chartType) => {
  console.log(`Attempting to fetch data for ${chartType} from Prometheus...`);
  if (!url) {
    console.error("URL is not constructed, cannot fetch data.");
    return;
  }
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    });
    console.log(`${chartType} DATA:`, JSON.stringify(response.data, null, 2)); // Print full response
    if (response.data) {
      ws.send(JSON.stringify({ chartType, data: response.data }));
    }
  } catch (error) {
    console.error(
      `Error fetching ${chartType} data from Prometheus:`,
      error.message
    );
  }
};


  const intervalId = setInterval(() => {
    fetchPrometheusData(constructedUrls.lineChartUrl, "lineChart");
    fetchPrometheusData(constructedUrls.barChartUrl, "barChart");
  }, 2000);

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
