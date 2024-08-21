import mongoose from "mongoose";

const PrometheusEndpointSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  baseUrl: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
});

const PrometheusEndpoint = mongoose.model(
  "PrometheusEndpoint",
  PrometheusEndpointSchema
);

export default PrometheusEndpoint;
