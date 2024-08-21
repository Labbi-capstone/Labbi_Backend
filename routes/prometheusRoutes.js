import express from "express";
import axios from "axios";
import PrometheusEndpoint from "../models/prometheusEndpoint.js";

const router = express.Router();

router.get("/prometheus-query", async (req, res) => {
  try {
    const { query, endpointName } = req.query;

    if (!query || !endpointName) {
      return res
        .status(400)
        .json({ message: "Query and endpointName parameters are required" });
    }

    // Fetch the endpoint configuration from the database
    const endpoint = await PrometheusEndpoint.findOne({ name: endpointName });

    if (!endpoint) {
      return res.status(404).json({ message: "Endpoint not found" });
    }

    // Build the full URL
    const fullUrl = `${endpoint.baseUrl}${
      endpoint.queryPath
    }?query=${encodeURIComponent(query)}`;

    // Make the request to Prometheus
    const response = await axios.get(fullUrl, {
      headers: {
        ...endpoint.headers.toObject(), // Spread headers stored in the DB (e.g., Authorization)
      },
    });

    // Return the data to the frontend
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); 

export default router;
