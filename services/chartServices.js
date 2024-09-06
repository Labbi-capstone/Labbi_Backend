import { Chart } from "../models/chartModel.js";
import PrometheusEndpoint from "../models/prometheusEndpointModel.js";
import Dashboard from "../models/dashboardModel.js";

// Create a new chart
export const createChart = async (chartData) => {
  const { name, chart_type, prometheus_endpoint_id, created_by, dashboard_id } =
    chartData;

  // Validate PrometheusEndpoint existence
  const endpoint = await PrometheusEndpoint.findById(prometheus_endpoint_id);
  if (!endpoint) {
    throw new Error("PrometheusEndpoint not found");
  }

  const newChart = new Chart({
    name,
    chart_type,
    prometheus_endpoint_id,
    created_by,
    dashboard_id,
  });

  return await newChart.save();
};

// Get a chart by ID
export const getChartById = async (id) => {
  const chart = await Chart.findById(id)

  return chart;
};

// Get all charts
export const getAllCharts = async () => {
  const charts = await Chart.find();
  return charts;
};

// Update a chart
export const updateChart = async (id, chartData) => {
  const { name, chart_type, prometheus_endpoint_id, is_active } = chartData;

  // Validate PrometheusEndpoint existence if being updated
  if (prometheus_endpoint_id) {
    const endpoint = await PrometheusEndpoint.findById(prometheus_endpoint_id);
    if (!endpoint) {
      throw new Error("PrometheusEndpoint not found");
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

  return updatedChart;
};

// Delete a chart
export const deleteChart = async (id) => {
  const deletedChart = await Chart.findByIdAndDelete(id);
  return deletedChart;
};

// Get charts by dashboard ID
export const getChartsByDashboardId = async (dashboardId) => {
  const charts = await Chart.find({ dashboard_id: dashboardId })

  return charts;
};

// Get charts by organization ID
export const getChartsByOrganizationId = async (organizationId) => {
  const dashboards = await Dashboard.find({ organization_id: organizationId });
  const dashboardIds = dashboards.map((dashboard) => dashboard._id);

  const charts = await Chart.find({
    dashboard_id: { $in: dashboardIds },
  })

  return charts;
};
