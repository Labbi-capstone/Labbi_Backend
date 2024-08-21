import mongoose from "mongoose";

const prometheusEndpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }, // e.g., "CPU Usage"
  baseUrl: {
    type: String,
    required: true,
  }, // Base URL for the Prometheus service
  queryPath: {
    type: String,
    required: true,
  }, // Path appended to the base URL
  headers: {
    type: Map,
    of: String, // For any custom headers, e.g., Authorization tokens
  },
});

const PrometheusEndpoint = mongoose.model(
  "PrometheusEndpoint",
  prometheusEndpointSchema
);

export default PrometheusEndpoint;
