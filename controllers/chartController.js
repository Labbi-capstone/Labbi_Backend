import { Chart } from "../models/chartModel.js";
import PrometheusEndpoint from "../models/prometheusEndpointModel.js";
import Dashboard from "../models/dashboardModel.js";
import * as chartService from "../services/chartServices.js";

export const createChart = async (req, res) => {
  try {
    const chartData = req.body;
    console.log("Incoming Chart Data:", chartData); // Log the incoming data
    const newChart = await chartService.createChart(chartData);
    console.log("Created Chart:", newChart); // Log the created chart
    return res.status(201).json(newChart);
  } catch (error) {
    console.error("Chart creation failed:", error.message); // Log the error
    return res.status(500).json({ error: error.message });
  }
};


export const getChartById = async (req, res) => {
  try {
    const { id } = req.params;
    const chart = await chartService.getChartById(id);

    if (!chart) {
      return res.status(404).json({ error: "Chart not found" });
    }

    return res.status(200).json(chart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllCharts = async (req, res) => {
  try {
    const charts = await chartService.getAllCharts();
    return res.status(200).json(charts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateChart = async (req, res) => {
  try {
    const { id } = req.params;
    const chartData = req.body;
    const updatedChart = await chartService.updateChart(id, chartData);

    if (!updatedChart) {
      return res.status(404).json({ error: "Chart not found" });
    }

    return res.status(200).json(updatedChart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const deleteChart = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChart = await chartService.deleteChart(id);

    if (!deletedChart) {
      return res.status(404).json({ error: "Chart not found" });
    }

    return res.status(200).json({ message: "Chart deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getChartsByDashboardId = async (req, res) => {
  try {
    const { dashboardId } = req.params;
    const charts = await chartService.getChartsByDashboardId(dashboardId);

    return res.status(200).json(charts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getChartsByOrganizationId = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const charts = await chartService.getChartsByOrganizationId(organizationId);

    return res.status(200).json(charts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
