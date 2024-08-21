import mongoose from "mongoose";
import dotenv from "dotenv";
import PrometheusEndpoint from "../models/PrometheusEndpointModel.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const seedEndpoints = async () => {
  const endpoints = [
    {
      name: "Go GC Duration",
      baseUrl: "http://14.224.155.240:10000",
      path: "/prometheus/api/v1/query?query=",
      query: "go_gc_duration_seconds",
    },
    {
      name: "Process Max FDs",
      baseUrl: "http://14.224.155.240:10000",
      path: "/prometheus/api/v1/query?query=",
      query: "process_max_fds",
    },
    {
      name: "Process CPU Usage",
      baseUrl: "http://14.224.155.240:10000",
      path: "/prometheus/api/v1/query?query=",
      query: "process_cpu_usage",
    },
    {
      name: "Prometheus HTTP Requests Total",
      baseUrl: "http://14.224.155.240:10000",
      path: "/prometheus/api/v1/query?query=",
      query: "prometheus_http_requests_total",
    },
  ];

  try {
    await PrometheusEndpoint.deleteMany(); // Clear existing endpoints
    await PrometheusEndpoint.insertMany(endpoints); // Insert new endpoints
    console.log("Prometheus endpoints seeded successfully!");
  } catch (error) {
    console.error("Error seeding Prometheus endpoints:", error);
  } finally {
    mongoose.connection.close(); // Close the connection after seeding
  }
};

seedEndpoints();
