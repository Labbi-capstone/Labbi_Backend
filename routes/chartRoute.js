import express from "express";
import {
  createChart,
  getChartById,
  getAllCharts,
  updateChart,
  deleteChart,
  getChartsByDashboardId,
  getChartsByOrganizationId,
} from "../controllers/chartController.js";

const router = express.Router();

router.post("/create", createChart);
router.get("/:id", getChartById);
router.get("/", getAllCharts);
router.put("/:id", updateChart);
router.delete("/:id", deleteChart);
router.get("/dashboard/:dashboardId", getChartsByDashboardId);
router.get("/organization/:organizationId", getChartsByOrganizationId);

export default router;
