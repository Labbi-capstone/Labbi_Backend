import express from "express";
import {
  createDashboard,
  getDashboards,
  updateDashboard,
  deleteDashboard,
} from "../controllers/dashboardController.js";
import { authenticateUser } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/create", authenticateUser, createDashboard);
router.get("/", authenticateUser, getDashboards);
router.put("/:id", authenticateUser, updateDashboard);
router.delete("/:id", authenticateUser, deleteDashboard);

export default router;
