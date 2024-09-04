import { Chart } from "../models/chartModel.js";
import PrometheusEndpoint from "../models/prometheusEndpointModel.js";
import Dashboard from "../models/dashboardModel.js";

export const createChart = async (req, res) => {
  try {
    const {
      name,
      chart_type,
      prometheus_endpoint_id,
      created_by,
      dashboard_id,
    } = req.body;

    // Validate PrometheusEndpoint existence
    const endpoint = await PrometheusEndpoint.findById(prometheus_endpoint_id);
    if (!endpoint) {
      return res.status(404).json({ error: "PrometheusEndpoint not found" });
    }

    // Create new chart
    const newChart = new Chart({
      name,
      chart_type,
      prometheus_endpoint_id,
      created_by,
      dashboard_id,
    });

    await newChart.save();

    return res.status(201).json(newChart);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getChartById = async (req, res) => {
  try {
    const { id } = req.params;
    const chart = await Chart.findById(id)
      .populate("prometheus_endpoint_id")
      .populate("dashboard_id");

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
    const charts = await Chart.find()
      .populate("prometheus_endpoint_id")
      .populate("dashboard_id");
    return res.status(200).json(charts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, chart_type, prometheus_endpoint_id, is_active } = req.body;

    // Validate PrometheusEndpoint existence if being updated
    if (prometheus_endpoint_id) {
      const endpoint = await PrometheusEndpoint.findById(
        prometheus_endpoint_id
      );
      if (!endpoint) {
        return res.status(404).json({ error: "PrometheusEndpoint not found" });
      }
    }

    const updatedChart = await Chart.findByIdAndUpdate(
      id,
      {
        name,
        chart_type,
        prometheus_endpoint_id,
        is_active,
        updated_at: Date.now(),
      },
      { new: true }
    );

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

    const deletedChart = await Chart.findByIdAndDelete(id);

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

    const charts = await Chart.find({ dashboard_id: dashboardId })
      .populate("prometheus_endpoint_id")
      .populate("dashboard_id");

    return res.status(200).json(charts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getChartsByOrganizationId = async (req, res) => {
  try {
    const { organizationId } = req.params;

    // Fetch dashboards by organization ID
    const dashboards = await Dashboard.find({
      organization_id: organizationId,
    });
    const dashboardIds = dashboards.map((dashboard) => dashboard._id);

    const charts = await Chart.find({
      dashboard_id: { $in: dashboardIds },
    })
      .populate("prometheus_endpoint_id")
      .populate("dashboard_id");

    return res.status(200).json(charts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
