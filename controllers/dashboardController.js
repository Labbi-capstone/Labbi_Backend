import DashboardService from "../services/dashboardServices.js";

// Only Admins can create a new dashboard
export const createDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can create dashboards." });
    }

    // Make sure that `created_by` is passed correctly
    const dashboard = await DashboardService.createDashboard({
      ...req.body,
      created_by: req.user.id, // This line ensures `created_by` is set
    });

    res.status(201).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve dashboards based on user roles
export const getDashboards = async (req, res) => {
  try {
    const dashboards = await DashboardService.getDashboardsForUser(req.user);
    res.status(200).json(dashboards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve dashboards based on orgID 
export const getDashboardsByOrg = async (req, res) => {
  try {
    const dashboards = await DashboardService.getDashboardsByOrg(req.params.id);
    res.status(200).json({dashboards});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Only Admins can update a dashboard
export const updateDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can update dashboards." });
    }

    const dashboard = await DashboardService.updateDashboard(
      req.params.id,
      req.body
    );
    if (!dashboard) {
      return res.status(404).json({ message: "Dashboard not found." });
    }

    res.status(200).json(dashboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Only Admins can delete a dashboard
export const deleteDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can delete dashboards." });
    }

    const result = await DashboardService.deleteDashboard(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Dashboard not found." });
    }

    res.status(200).json({ message: "Dashboard deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  createDashboard,
  getDashboards,
  updateDashboard,
  deleteDashboard,
};
