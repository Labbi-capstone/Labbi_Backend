import express from "express";
import {
  createEndpoint,
  getAllEndpoints,
  getEndpointById,
  updateEndpointById,
  deleteEndpointById,
  constructPrometheusUrl,
} from "../controllers/prometheusController.js";

const router = express.Router();

// Route to create a new Prometheus endpoint
router.post("/", createEndpoint);

// Route to get all Prometheus endpoints
router.get("/", getAllEndpoints);

// Route to get a specific Prometheus endpoint by ID
router.get("/:id", getEndpointById);

// Route to update a specific Prometheus endpoint by ID
router.put("/:id", updateEndpointById);

// Route to delete a specific Prometheus endpoint by ID
router.delete("/:id", deleteEndpointById);

// Route to construct the full URL for a Prometheus endpoint by ID
router.get("/construct-url/:id", constructPrometheusUrl);


export default router;
 