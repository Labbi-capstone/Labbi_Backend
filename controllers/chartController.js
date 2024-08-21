import { Chart } from "../models/chartModel.js";

export const createChartAndAddToDashboard = async (req, res) => {
  try {
    const { name, query_url, query_params, chart_type, dashboard_id } =
      req.body;

    // Create the new chart
    const chart = new Chart({
      name,
      query_url,
      query_params,
      chart_type,
      created_by: req.user._id,
    });
    await chart.save();

    // Add the chart ID to the dashboard
    await Dashboard.findByIdAndUpdate(dashboard_id, {
      $push: { chart_ids: chart._id },
    });

    res.status(201).json(chart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getChartsByDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findById(
      req.params.dashboard_id
    ).populate("chart_ids");
    if (!dashboard)
      return res.status(404).json({ message: "Dashboard not found" });

    res.status(200).json(dashboard.chart_ids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChart = async (req, res) => {
  try {
    const chart = await Chart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!chart) {
      return res.status(404).json({ message: "Chart not found" });
    }

    res.status(200).json(chart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeChartFromDashboard = async (req, res) => {
  try {
    const { dashboard_id, chart_id } = req.body;

    await Dashboard.findByIdAndUpdate(dashboard_id, {
      $pull: { chart_ids: chart_id },
    });

    res.status(200).json({ message: "Chart removed from dashboard" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

